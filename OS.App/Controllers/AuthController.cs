using Microsoft.AspNetCore.Mvc;
using OS.Core.Application;
using OS.Core.Application.Dtos;
using OS.Core.Domain.OfficeSupplies;
using OS.Core.Domain.Reponsitories;
using UA.Core.Application.SeedWork;

namespace OS.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAccountReponsitory accountRepo;

        public AuthController(IAccountReponsitory repo)
        {
            accountRepo = repo;
        }

        [HttpPost("SigUp")]
        public async Task<IActionResult> SigUp(Sigup sigup)
        {
            var res = new ApiResult<IEnumerable<bool>>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var result = await accountRepo.SignUpAsync(sigup);

            if (result.Succeeded)
            {
                res.Successed = true;
                res.Message = AppConsts.MSG_CREATED_SUCCESSFULL;
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
            var res = new ApiResult<TokenDto>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };
            var tokenDto = await accountRepo.RefreshTokenAsync(model.Email!, model.RefreshToken!);

            if (tokenDto == null)
            {
                res.ResponseCode = StatusCodes.Status401Unauthorized;
            }
            else
            {
                res.Successed = true;
                res.Message = AppConsts.MSG_CREATED_SUCCESSFULL;
                res.Data = tokenDto;
            }

            return Ok(res);
        }


        [HttpPost("SigIn")]
        public async Task<IActionResult> SigIn(Sigin sigin)
        {
            var res = new ApiResult<TokenDto>
            {
                Successed = false,
                ResponseCode = StatusCodes.Status200OK,
            };

            var result = await accountRepo.SigInAsync(sigin);

            if (result == null)
            {
                res.ResponseCode = StatusCodes.Status401Unauthorized;
            }
            else
            {
                res.Successed = true;
                res.Message = AppConsts.MSG_CREATED_SUCCESSFULL;
                res.Data = result;
            }
            return Ok(res);
        }


        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole(string roleName)
        {
            var result = await accountRepo.CreateRoleAsync(roleName);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }


        [HttpPost("AssignUserRole")]
        public async Task<IActionResult> AssignUserRole(string userId, string roleName)
        {
            var result = await accountRepo.AssignUserRoleAsync(userId, roleName);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

    }
}
