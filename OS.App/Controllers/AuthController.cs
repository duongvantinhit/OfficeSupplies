using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
            var tokenDto = await _accountRepo.RefreshTokenAsync(model.Email!, refreshToken!);

            if (tokenDto == null)
            {
                Response.Cookies.Delete("refresh_token");
                Response.Cookies.Delete("access_token");
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
                SetAuthCookies(result.AccessToken!, result.RefreshToken!);
                res.Successed = true;
            }
            return Ok(res);
        }

        private void SetAuthCookies(string accessToken, string refreshToken)
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
        }


        [HttpPost("create/role")]
        public async Task<IActionResult> CreateRole(string roleName)
        {
            var result = await _accountRepo.CreateRoleAsync(roleName);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpPost("assign/user/role")]
        public async Task<IActionResult> AssignUserRole(string userId, string roleName)
        {
            var result = await _accountRepo.AssignUserRoleAsync(userId, roleName);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

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
    }
}
