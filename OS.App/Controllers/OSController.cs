using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OS.Core.Application;
using OS.Core.Application.Dtos;
using OS.Core.Domain.OfficeSupplies;
using OS.Core.Infrastructure.Database;
using System.Text.RegularExpressions;
using UA.Core.Application.SeedWork;

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

        #region httpGET
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
        public async Task<IActionResult> GetAllCategories([FromQuery] ApiRequest request)
        {
            var res = new ApiResult<IEnumerable<Categories>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Categories.AsNoTracking();

            res.TotalRows = query.Count();
            int skip = request.PageSize * (request.PageIndex - 1);
            res.Data = query.Skip(skip).Take(request.PageSize);
            return Ok(res);
        }

        [HttpGet("categories/{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var res = new ApiResult<Categories>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Categories.AsNoTracking()
                .Where(x => x.Id == id);

            res.TotalRows = query.Count();
            res.Data = await query.FirstOrDefaultAsync();
            return Ok(res);
        }

        #endregion httpGET

        #region httpPOST
        [HttpPost("categories")]
        public async Task<IActionResult> Upload([FromForm] UpLoadImageDto model)
        {
            var res = new ApiResult<IEnumerable<Categories>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            try
            {
                IFormFile file = model.File!;

                if (file != null && file.Length > 0)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    fileName = Regex.Replace(fileName, @"[^\w\.]", "");

                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
                    var imageUrl = $"{baseUrl}/Images/{fileName}";

                    Categories createCategy = new()
                    {
                        CategoryName = model.CategoryName,
                        ImageURL = imageUrl,
                        CategoryDescription = model.CategoryDescription,
                        CreatedByUserId = model.CreatedByUserId,
                        CreatedDate = model.CreatedDate.ToLocalTime(),
                    };

                    _context.Add(createCategy);
                    await _context.SaveChangesAsync();
                    res.Message = AppConsts.MSG_CREATED_SUCCESSFULL;
                }
                else
                {
                    res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
                }
            }
            catch (Exception ex)
            {
                res.Successed = false;
                res.Message = ex.Message;
                res.ResponseCode = StatusCodes.Status500InternalServerError;
            }
            return Ok(res);
        }
        #endregion httpPOST

        #region httpDelete
        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategogy(int id)
        {
            var res = new ApiResult<IEnumerable<Categories>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            Categories category = _context.Categories.Find(id)!;
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            res.Message = AppConsts.MSG_UPDATED_SUCCESSFULL;
            return Ok(res);
        }


        #endregion httpDelete
    }
}
