using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OS.Core.Application;
using OS.Core.Domain.OfficeSupplies;
using OS.Core.Infrastructure.Database;

namespace OS.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OSController : ControllerBase
    {
        private readonly OsDbContext _context;

        public OSController(OsDbContext context) {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var res = new ApiResult<IEnumerable<Users>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Users.AsNoTracking();
            res.Data = await query.ToListAsync();
            return Ok(res);
        }

    }
}
