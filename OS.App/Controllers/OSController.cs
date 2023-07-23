using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OS.Core.Application;
using OS.Core.Application.Dtos;
using OS.Core.Domain.OfficeSupplies;
using OS.Core.Infrastructure.Database;
using System.Security.Claims;
using System.Text.RegularExpressions;
using UA.Core.Application.SeedWork;

namespace OS.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OSController : ControllerBase
    {
        private readonly OsDbContext _context;
        private readonly IHttpContextAccessor _httpContext;

        public OSController(OsDbContext context, IHttpContextAccessor httpContext)
        {
            _context = context;
            _httpContext = httpContext;
        }

        #region httpGET

        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCategories([FromQuery] ApiRequest request)
        {
            var res = new ApiResult<IEnumerable<Categories>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Categories.AsNoTracking();
            var sortedDatas = await query.OrderBy(post => post.CategoryName).ToListAsync();

            res.TotalRows = sortedDatas.Count;
            int skip = request.PageSize * (request.PageIndex - 1);
            res.Data = sortedDatas.Skip(skip).Take(request.PageSize);
            return Ok(res);
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetAllProducts([FromQuery] ApiRequest request)
        {
            var res = new ApiResult<IEnumerable<Product>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Products.AsNoTracking();
            var sortedDatas = await query.OrderBy(post => post.ProductName).ToListAsync();

            res.TotalRows = sortedDatas.Count;
            int skip = request.PageSize * (request.PageIndex - 1);
            res.Data = sortedDatas.Skip(skip).Take(request.PageSize);
            return Ok(res);
        }


        [HttpGet("categories/{id}")]
        public async Task<IActionResult> GetCategory(string id)
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

        [HttpGet("product/{id}")]
        public async Task<IActionResult> GetProduct(string id)
        {
            var res = new ApiResult<Product>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Products.AsNoTracking()
                .Where(x => x.Id == id);

            res.TotalRows = query.Count();
            res.Data = await query.FirstOrDefaultAsync();
            return Ok(res);
        }

        #endregion httpGET

        #region httpPOST
        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromForm] CategoryDto model)
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
                    var fileExtension = Path.GetExtension(file.FileName);
                    var fileName = Guid.NewGuid().ToString() + fileExtension;
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
                    var imageUrl = $"{baseUrl}/Images/{fileName}";
                    var userId = _httpContext.HttpContext!.User.FindFirstValue("id");

                    Categories createCategy = new()
                    {
                        Id = Guid.NewGuid().ToString(),
                        CategoryName = model.CategoryName,
                        ImageURL = imageUrl,
                        CategoryDescription = model.CategoryDescription,
                        CreatedByUserId = userId,
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


        [HttpPost("product")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductDto model)
        {
            var res = new ApiResult<IEnumerable<Product>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            try
            {
                IFormFile file = model.File!;

                if (file != null && file.Length > 0)
                {
                    var fileExtension = Path.GetExtension(file.FileName);
                    var fileName = Guid.NewGuid().ToString() + fileExtension;
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
                    var imageUrl = $"{baseUrl}/Images/{fileName}";
                    var userId = _httpContext.HttpContext!.User.FindFirstValue("id");

                    Product createProduct = new()
                    {
                        Id = Guid.NewGuid().ToString(),
                        ProductName = model.ProductName,
                        QuantityInStock = model.QuantityInStock,
                        CategoryId = model.CategoryId,
                        Trademark = model.Trademark,
                        ProductDescription = model.ProductDescription,
                        Price = model.Price,
                        ImageURL = imageUrl,
                        Status = model.Status,
                        CountryOfOrigin = model.CountryOfOrigin,
                        Warranty = model.Warranty,
                        WarrantyDescription = model.WarrantyDescription,
                        CreatedByUserId = userId,
                        CreatedDate = model.CreatedDate.ToLocalTime()
                    };

                    _context.Add(createProduct);
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

        #region httpDELETE
        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            var res = new ApiResult<IEnumerable<Categories>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };
            
            Categories category = _context.Categories.Find(id)!;
            _context.Categories.Remove(category);

            string imageName = Path.GetFileName(category.ImageURL)!;
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", imageName);

            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);   
            }

            await _context.SaveChangesAsync();
            res.Message = AppConsts.MSG_UPDATED_SUCCESSFULL;
            return Ok(res);
        }

        [HttpDelete("product/{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            var res = new ApiResult<IEnumerable<Product>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            Product product = _context.Products.Find(id)!;
             _context.Products.Remove(product);

            string imageName = Path.GetFileName(product.ImageURL)!;
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", imageName);

            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }

            await _context.SaveChangesAsync();
            res.Message = AppConsts.MSG_UPDATED_SUCCESSFULL;
            return Ok(res);
        }


        #endregion httpDELETE

        #region httpPUT
        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory([FromForm] UpdateCategoryDto categoryDto, string id)
        {
            var res = new ApiResult<bool>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            IFormFile file = categoryDto.File!;

            var category = await _context.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

            if (category == null || categoryDto == null)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
                return Ok(res);
            }

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

                category.ImageURL = imageUrl;
            }

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");

            category.CategoryName = categoryDto.CategoryName;
            category.CategoryDescription = categoryDto.CategoryDescription;
            category.CreatedByUserId = userId;
            category.ModifiedDate = DateTime.Parse(categoryDto.ModifiedDate.ToString()!).ToLocalTime();

            try
            {
                _context.Update(category);
                await _context.SaveChangesAsync();
                res.Message = AppConsts.MSG_UPDATED_SUCCESSFULL;
            }
            catch (Exception ex)
            {
                res.Successed = false;
                res.Message = ex.Message;
                res.ResponseCode = StatusCodes.Status500InternalServerError;
            }

            return Ok(res);
        }


        [HttpPut("product/{id}")]
        public async Task<IActionResult> UpdateProduct([FromForm] UpdateProductDto productDto, string id)
        {
            var res = new ApiResult<bool>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            IFormFile file = productDto.File!;

            var product = await _context.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

            if (product == null || productDto == null)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
                return Ok(res);
            }

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

                product.ImageURL = imageUrl;
            }

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");

            product.ProductName = productDto.ProductName;
            product.QuantityInStock = productDto.QuantityInStock;
            product.CategoryId = productDto.CategoryId;
            product.Trademark = productDto.Trademark;
            product.ProductDescription = productDto.ProductDescription;
            product.Price = productDto.Price;
            product.Status = productDto.Status;
            product.CountryOfOrigin = productDto.CountryOfOrigin;
            product.Warranty = productDto.Warranty;
            product.WarrantyDescription = productDto.WarrantyDescription;
            product.CreatedByUserId = userId;
            product.ModifiedDate = productDto.ModifiedDate;

            try
            {
                _context.Update(product);
                await _context.SaveChangesAsync();
                res.Message = AppConsts.MSG_UPDATED_SUCCESSFULL;
            }
            catch (Exception ex)
            {
                res.Successed = false;
                res.Message = ex.Message;
                res.ResponseCode = StatusCodes.Status500InternalServerError;
            }

            return Ok(res);
        }

        #endregion
    }
}
