using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using OS.Core.Application.Dtos;
using OS.Core.Domain.OfficeSupplies;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace OS.Core.Domain.Reponsitories
{
    public class AccountReponsitory : IAccountReponsitory
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IConfiguration configuration;
        private readonly RoleManager<IdentityRole> roleManager;

        public AccountReponsitory(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager, IConfiguration configuration,
            RoleManager<IdentityRole> roleManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.roleManager = roleManager;
        }

        public async Task<TokenDto> SigInAsync(SignIn model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if(user == null)
            {
                return null!;
            }
            var passwordHasher = new PasswordHasher(configuration);
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password!);

            if (await userManager.IsLockedOutAsync(user))
            {
                return null!;
            }
            
            if (result != PasswordVerificationResult.Success)
            {
                await userManager.AccessFailedAsync(user);
                var accessFailedCount = await userManager.GetAccessFailedCountAsync(user);

                if (accessFailedCount >= 5)
                {
                    await userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddMinutes(10));
                }

                return null!;
            }
            else
            {
                await userManager.ResetAccessFailedCountAsync(user);
            }

            var accessTokenString = await GenerateAccessTokenAsync(model.Email!, user);
            var refreshTokenString = await GenerateRefreshTokenAsync();

            await userManager.RemoveAuthenticationTokenAsync(user, "Bearer", "access_token");
            await userManager.RemoveAuthenticationTokenAsync(user, "Bearer", "refresh_token");
            await userManager.SetAuthenticationTokenAsync(user, "Bearer", "access_token", accessTokenString);
            await userManager.SetAuthenticationTokenAsync(user, "Bearer", "refresh_token", refreshTokenString);

            return new TokenDto
            {
                AccessToken = accessTokenString,
                RefreshToken = refreshTokenString
            };
        }

        public async Task<TokenDto> RefreshTokenAsync(string email, string refreshToken)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return null!;
            }

            var refreshTokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var refreshTokenJwt = refreshTokenHandler.ReadJwtToken(refreshToken);
                if (refreshTokenJwt == null || refreshTokenJwt.ValidTo < DateTime.UtcNow)
                {
                    return null!;
                }
            }
            catch (Exception)
            {
                return null!;
            };

            var storedRefreshToken = await userManager.GetAuthenticationTokenAsync(user, "Bearer", "refresh_token");

            if (storedRefreshToken != refreshToken)
            {
                return null!;
            }

            var newAccessTokenString = await GenerateAccessTokenAsync(email, user);
            var newRefreshTokenString = await GenerateRefreshTokenAsync();

            await userManager.RemoveAuthenticationTokenAsync(user, "Bearer", "access_token");
            await userManager.RemoveAuthenticationTokenAsync(user, "Bearer", "refresh_token");
            await userManager.SetAuthenticationTokenAsync(user, "Bearer", "access_token", newAccessTokenString);
            await userManager.SetAuthenticationTokenAsync(user, "Bearer", "refresh_token", newRefreshTokenString);

            return new TokenDto
            {
                AccessToken = newAccessTokenString,
                RefreshToken = newRefreshTokenString
            };
        }

        public async Task<string> GenerateAccessTokenAsync(string email, ApplicationUser user)
        {
            var roles = await userManager.GetRolesAsync(user);
            var securityStampClaim = new Claim(new ClaimsIdentityOptions().SecurityStampClaimType, user.SecurityStamp);

            var authClaims = new List<Claim>
            {
                new Claim("email",email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("role", string.Join(",", roles)),
                new Claim("id", user.Id.ToString()),
                new Claim(new ClaimsIdentityOptions().SecurityStampClaimType, user.SecurityStamp),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
            var Token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddMinutes(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256Signature)
            );

            return new JwtSecurityTokenHandler().WriteToken(Token);
        }

        public async Task<string> GenerateRefreshTokenAsync()
        {
            var refreshToken = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddDays(7)
            );

            return await Task.FromResult(new JwtSecurityTokenHandler().WriteToken(refreshToken));
        }

        public async Task<IdentityResult> SignUpAsync(SignUp model)
        {
            var user = new ApplicationUser
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                UserName = model.Email,
                Address = model.Address
            };

            return await userManager.CreateAsync(user, model.Password);
        }

        public async Task<IdentityResult> CreateRoleAsync(string roleName)
        {
            var roleExists = await roleManager.RoleExistsAsync(roleName);
            if (!roleExists)
            {
                var role = new IdentityRole(roleName);
                return await roleManager.CreateAsync(role);
            }
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> AssignUserRoleAsync(string userId, string roleName)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return null!;
            }
            else
            {
                /* var adminRole = await roleManager.FindByNameAsync("admin");
                 var employeeRole = await roleManager.FindByNameAsync("employee");

                 await roleManager.AddClaimAsync(adminRole, new Claim("ManageProducts", "true"));
                 await roleManager.AddClaimAsync(adminRole, new Claim("ManageOrders", "true"));
                 await roleManager.AddClaimAsync(adminRole, new Claim("ManageUsers", "true"));

                 await roleManager.AddClaimAsync(employeeRole, new Claim("ManageProducts", "true"));
                 await roleManager.AddClaimAsync(employeeRole, new Claim("ManageOrders", "true"));
                 await roleManager.AddClaimAsync(employeeRole, new Claim("ManageUsers", "false"));*/

                await userManager.AddToRoleAsync(user, roleName);
                return IdentityResult.Success;
            }
        }

        public async Task<UserDto> GetUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            var roles = (await userManager.GetRolesAsync(user));
            var filteredRoles = roles?.Where(r => r != null).ToList();

            if (user == null)
            {
                return null!;
            }

            var userDto = new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Roles = filteredRoles!.Any() ? filteredRoles : null,
                Address = user.Address,
            };

            return userDto;
        }

        public async Task<IdentityResult> ChangePasswordAsync(ChangePasswordDto changePasswordDto)
        {
            var user = await userManager.FindByEmailAsync(changePasswordDto.Email);

            if (user == null)
            {
                return null!;
            }

            var result = await userManager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);

            if (!result.Succeeded)
            {
                return result;
            }
            else
            {
                await signInManager.SignOutAsync();
                await userManager.UpdateSecurityStampAsync(user);
                await userManager.RemoveAuthenticationTokenAsync(user, "Bearer", "refresh_token");
                return IdentityResult.Success;
            }
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await userManager.Users.ToListAsync();

            if (users == null)
            {
                return null!;
            }

            var userDtos = users.Select(u => new UserDto
            {
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                Address = u.Address,
                Id = u.Id,
            }).ToList();

            return userDtos;
        }

        public async Task<List<string>> GetRolesAsync()
        {
            var roles = await roleManager.Roles.ToListAsync();

            if (roles == null)
            {
                return null!;
            }

            if (!roles.Any())
            {
                return new List<string>();
            }

            return roles.Select(r => r.Name).ToList();
        }

        public async Task<List<string>> GetUserRolesAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            var roles = (await userManager.GetRolesAsync(user));
            var filteredRoles = roles?.Where(r => r != null).ToList();
            if (filteredRoles!.Any())
            {
                return filteredRoles!;
            }
            else
            {
                return null!;
            }
        }

        public async Task<IdentityResult> RemoveUserRoleAsync(string userId, string roleName)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null!;
            }

            var result = await userManager.RemoveFromRoleAsync(user, roleName);

            if (!result.Succeeded)
            {
                return result;
            }
            else
            {
                await signInManager.SignOutAsync();
                await userManager.UpdateSecurityStampAsync(user);
                await userManager.RemoveAuthenticationTokenAsync(user, "Bearer", "refresh_token");
                return IdentityResult.Success;
            }
        }

        public async Task<IdentityResult> UpdateUserAsync(UserDto userDto, string id)
        {
            var user = await userManager.FindByIdAsync(id);

            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "User not found." });
            }

            user.Email = userDto.Email;
            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.PhoneNumber = userDto.PhoneNumber;
            user.Address = userDto.Address;

            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return result;
            }
            else
            {
                return IdentityResult.Success;
            }
        }
    }
}
