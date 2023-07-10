using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OS.Core.Application;
using OS.Core.Application.Dtos;
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

        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var res = new ApiResult<IEnumerable<Categories>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Categories.AsNoTracking();
            res.Data = await query.ToListAsync();
            return Ok(res);
        }


        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromQuery] IFormFile file)
        {
            try
            {
                if (file != null && file.Length > 0)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
                    var imageUrl = $"{baseUrl}/Uploads/{fileName}";

                    var imageInfo = new ImageInfo
                    {
                        FileName = fileName,
                        Url = imageUrl,
                        Size = file.Length,
                        ContentType = file.ContentType
                    };

                    return Ok(imageInfo);
                }
                else
                {
                    return BadRequest("No file was uploaded.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

    }
}
