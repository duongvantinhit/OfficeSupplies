using Microsoft.AspNetCore.Identity;
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

        public AccountReponsitory(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.roleManager = roleManager;
        }

        /* public async Task<TokenDto> SigInAsync(Sigin model)
         {
             var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
             if (!result.Succeeded)
             {
                 return await Task.FromResult<TokenDto>(null);
             }

             var user = await userManager.FindByEmailAsync(model.Email);
             var roles = await userManager.GetRolesAsync(user);

             var authClaims = new List<Claim>
                 {
                    new Claim(ClaimTypes.Email, model.Email!),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    *//*new Claim(ClaimTypes.Role, string.Join(",", roles)),*//*
                    new Claim("role", string.Join(",", roles))
                 };

             var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

             var token = new JwtSecurityToken(
                 issuer: configuration["JWT:ValidIssuer"],
                 audience: configuration["JWT:ValidAudience"],
                 expires: DateTime.Now.AddMinutes(1),
                 claims: authClaims,
                 signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha512Signature)
             );

             var tokenDto = new TokenDto
             {
                 Token = new JwtSecurityTokenHandler().WriteToken(token)
             };

             return await Task.FromResult(tokenDto);
         }*/

        public async Task<TokenDto> SigInAsync(Sigin model)
        {
            var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
            if (!result.Succeeded)
            {
                return null!;
            }

            var user = await userManager.FindByEmailAsync(model.Email);
            var roles = await userManager.GetRolesAsync(user);

            // Tạo mới accessToken và refreshToken
            var authClaims = new List<Claim>
            {
                /*new Claim(ClaimTypes.Email, model.Email!),*/
                new Claim("email", model.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("role", string.Join(",", roles))
            };

            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

            var accessToken = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddMinutes(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256Signature)
            );

            var accessTokenString = new JwtSecurityTokenHandler().WriteToken(accessToken);

            var refreshToken = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddDays(7),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256Signature)
            );

            var refreshTokenString = new JwtSecurityTokenHandler().WriteToken(refreshToken);

            // Lưu trữ accessToken và refreshToken vào Identity
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
            var roles = await userManager.GetRolesAsync(user);
            if (user == null)
            {
                return null!;
            }

            // Lấy accessToken từ Identity
            var accessToken = await userManager.GetAuthenticationTokenAsync(user, "Bearer", "access_token");

            // Kiểm tra refreshToken có hợp lệ hay không
            var refreshTokenHandler = new JwtSecurityTokenHandler();
            var refreshTokenJwt = refreshTokenHandler.ReadJwtToken(refreshToken);

            if (refreshTokenJwt == null || refreshTokenJwt.ValidTo < DateTime.UtcNow)
            {
                return null!;
            }

            // Kiểm tra xem refreshToken có trùng với refreshToken được lưu trữ trong Identity hay không
            var storedRefreshToken = await userManager.GetAuthenticationTokenAsync(user, "Bearer", "refresh_token");
            if (storedRefreshToken != refreshToken)
            {
                return null!;
            }

            // Tạo mới accessToken và refreshToken
            var authClaims = new List<Claim>
            {
                 /* new Claim(ClaimTypes.Email, model.Email!),*/
                new Claim("email", user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("role", string.Join(",", roles))
            };

            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

            var newAccessToken = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddMinutes(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256Signature)
            );

            var newAccessTokenString = new JwtSecurityTokenHandler().WriteToken(newAccessToken);

            var newRefreshToken = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddDays(7),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256Signature)
            );

            var newRefreshTokenString = new JwtSecurityTokenHandler().WriteToken(newRefreshToken);

            // Lưu trữ accessToken và refreshToken mới vào Identity
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

        public async Task<IdentityResult> SignUpAsync(Sigup model)
        {
            var user = new ApplicationUser
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                UserName = model.Email
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
            if (user != null)
            {
                return await userManager.AddToRoleAsync(user, roleName);
            }
            return IdentityResult.Failed(new IdentityError { Description = $"Không tìm thấy người dùng với ID '{userId}'." });
        }

    }
}
