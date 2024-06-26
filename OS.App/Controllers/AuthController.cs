﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OS.Core.Application;
using OS.Core.Application.Dtos;
using OS.Core.Domain.Reponsitories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using UA.Core.Application.SeedWork;

namespace OS.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAccountReponsitory _accountRepo;
        private readonly IHttpContextAccessor _httpContext;

        public AuthController(IAccountReponsitory repo, IHttpContextAccessor httpContext)
        {
            _accountRepo = repo;
            _httpContext = httpContext;
        }

        #region httpGET
        [HttpGet("user/infor")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetUser()
        {
            var res = new ApiResult<UserDto>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");
            var userDto = await _accountRepo.GetUserAsync(userId);

            if (userDto == null)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
            }
            else
            {
                res.Successed = true;
                res.Data = userDto;
            }

            return Ok(res);
        }

        [HttpGet("users")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetAllUsersAsync()
        {
            var res = new ApiResult<List<UserDto>>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };
            var users = await _accountRepo.GetAllUsersAsync();

            if (users == null)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
            }
            else
            {
                res.Successed = true;
                res.Data = users;
            }

            return Ok(res);
        }


        [HttpGet("roles")]
        [Authorize]
        public async Task<ActionResult<List<string>>> GetRoles ()
        {
            var res = new ApiResult<List<string>>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };
            var users = await _accountRepo.GetRolesAsync();

            if (users == null)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
            }
            else
            {
                res.Successed = true;
                res.Data = users;
            }

            return Ok(res);
        }

        [HttpGet("user/roles/{userId}")]
        
        public async Task<ActionResult<List<string>>> GetUserRoles(string userId)
        {
            var res = new ApiResult<List<string>>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };
            var users = await _accountRepo.GetUserRolesAsync(userId);

            if (users == null)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
            }
            else
            {
                res.Successed = true;
                res.Data = users;
            }

            return Ok(res);
        }

        #endregion

        #region httpPOST
        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp(SignUp signup)
        {
            var res = new ApiResult<IEnumerable<bool>>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var result = await _accountRepo.SignUpAsync(signup);

            if (result.Succeeded)
            {
                res.Successed = true;
                res.Message = AppConsts.MSG_LOGIN_SUCCESSFULL;
            }
            else
            {
                res.ResponseCode = StatusCodes.Status401Unauthorized;
            }

            return Ok(res);
        }

        [HttpPost("refreshtoken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto model)
        {
            var res = new ApiResult<string>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            string refreshToken = HttpContext.Request.Cookies["refresh_token"]!;
            string email = HttpContext.Request.Cookies["email"]!;

            if(email == null)
            {
                res.ResponseCode = StatusCodes.Status401Unauthorized;
                return Ok(res);
            }

            var tokenDto = await _accountRepo.RefreshTokenAsync(email, refreshToken!);

            if (tokenDto == null)
            {
                Response.Cookies.Delete("refresh_token");
                Response.Cookies.Delete("access_token");
                Response.Cookies.Delete("email");
                res.ResponseCode = StatusCodes.Status401Unauthorized;
            }
            else
            {
                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                JwtSecurityToken decodedToken = tokenHandler.ReadJwtToken(tokenDto.AccessToken);
                string? exp = decodedToken.Claims.FirstOrDefault(c => c.Type == "exp")?.Value;

                SetAuthCookies(tokenDto.AccessToken!, tokenDto.RefreshToken!);
                res.Successed = true;
                res.Data = exp;
            }

            return Ok(res);
        }


        [HttpPost("sign-in")]
        public async Task<IActionResult> SignIn(SignIn signin)
        {
            var res = new ApiResult<string>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var result = await _accountRepo.SigInAsync(signin);

            if (result == null)
            {
                res.ResponseCode = StatusCodes.Status401Unauthorized;
            }
            else
            {
                SetAuthCookies(result.AccessToken!, result.RefreshToken!, signin.Email!);
                res.Successed = true;
            }
            return Ok(res);
        }

        [HttpPost("check-password")]
        public async Task<IActionResult> CheckPassword(CheckPasswordDto checkPassword)
        {
            var res = new ApiResult<string>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            string email = HttpContext.Request.Cookies["email"]!;

            if (email == null)
            {
                res.ResponseCode = StatusCodes.Status401Unauthorized;
                return Ok(res);
            }

            var result = await _accountRepo.CheckPasswordAsync(email,checkPassword.Password!);

            if (result == null)
            {
                res.ResponseCode = StatusCodes.Status401Unauthorized;
            }
            else
            {
                res.Successed = true;
            }
            return Ok(res);
        }

        [HttpPost("create/role")]
        [Authorize]
        public async Task<IActionResult> CreateRole(string roleName)
        {
            var res = new ApiResult<string>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var result = await _accountRepo.CreateRoleAsync(roleName);

            if (result.Succeeded)
            {
                res.Successed = true;
                res.Message = AppConsts.MSG_CREATED_SUCCESSFULL;
            }
            else
            {
                res.Message = AppConsts.MSG_SAVED_FAILED;
            }

            return Ok(res);
        }

        [HttpPost("assign/user/role")]
        [Authorize]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> AssignUserRole(UserRolesDto dto)
        {
            var res = new ApiResult<string>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var result = await _accountRepo.AssignUserRoleAsync(dto.UserId!, dto.Role!);

            if (result.Succeeded)
            {
                res.Successed = true;
                res.Message = AppConsts.MSG_SAVED_SUCCESSFULL;
            }
            else
            {
                res.Message = AppConsts.MSG_SAVED_FAILED;
            }

            return Ok(res);
        }

        #endregion

        #region httpPUT
        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordDto changePasswordDto)
        {
            var res = new ApiResult<UserDto>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var result = await _accountRepo.ChangePasswordAsync(changePasswordDto);

            if (!result.Succeeded)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
            }
            else
            {
                res.Successed = true;
                res.Message = AppConsts.MSG_CHANGE_PASSWORD_SUCCESSFULL;
            }

            return Ok(res);
        }

        [HttpPut("change-user/infor")]
        [Authorize]
        public async Task<IActionResult> UpdateUser([FromBody] UserDto userDto)
        {
            var res = new ApiResult<UserDto>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");
            var result = await _accountRepo.UpdateUserAsync(userDto, userId);

            if (!result.Succeeded)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
            }
            else
            {
                res.Successed = true;
                res.Message = AppConsts.MSG_CHANGE_PASSWORD_SUCCESSFULL;
            }

            return Ok(res);
        }

        #endregion

        #region httpDELETE

        [HttpDelete("remove/{userId}/{role}")]
        [Authorize]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> RemoveUserRole(string userId, string role)
        {
            var res = new ApiResult<UserDto>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var result = await _accountRepo.RemoveUserRoleAsync(userId, role);

            if (result.Succeeded)
            {
                res.Successed = true;
                res.Message = AppConsts.MSG_UPDATED_SUCCESSFULL;
            }
            else
            {
                res.Message = AppConsts.MSG_UPDATED_FAILED;
            }

            return Ok(res);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");
            Response.Cookies.Delete("email");
            return Ok();
        }

        #endregion

        private void SetAuthCookies(string accessToken, string refreshToken, string email = null!)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true,
                Path = "/",
                Expires = DateTime.Now.AddDays(7)
            };

            Response.Cookies.Append("access_token", accessToken, cookieOptions);
            Response.Cookies.Append("refresh_token", refreshToken, cookieOptions);
            if (email != null)
            {
                Response.Cookies.Append("email", email, cookieOptions);
            }
        }
    }
}
