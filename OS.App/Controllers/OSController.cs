using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OS.Core.Application;
using OS.Core.Application.Dtos;
using OS.Core.Domain.OfficeSupplies;
using OS.Core.Infrastructure.Database;
using System.Security.Claims;
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

        [HttpGet("top/categories")]
        public async Task<IActionResult> GetTopCategories()
        {
            var res = new ApiResult<IEnumerable<Categories>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Categories.AsNoTracking();
            var sortedDatas = await query.OrderBy(post => post.CategoryName).Take(3).ToListAsync();

            res.Data = sortedDatas;
            return Ok(res);
        }

        [HttpGet("categories/name")]
        public async Task<IActionResult> GetAllCategoriesName()
        {
            var res = new ApiResult<IEnumerable<object>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Categories.AsNoTracking();
            var sortedDatas = await query.OrderBy(post => post.CategoryName).Select(data => new
            {
                data.Id,
                data.CategoryName
            }).ToListAsync();

            res.Data = sortedDatas;
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

        [HttpGet("{caterogyId}/product")]
        public async Task<IActionResult> GetProductCatalogue([FromQuery] ApiRequest request, string caterogyId)
        {
            var res = new ApiResult<IEnumerable<Product>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Products.Where(x => x.CategoryId == caterogyId).AsNoTracking();
            var sortedDatas = await query.OrderBy(post => post.ProductName).ToListAsync();

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

        [HttpGet("top/products")]
        public async Task<IActionResult> GetTopProducts()
        {
            var res = new ApiResult<IEnumerable<Product>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Products.AsNoTracking();
            var sortedDatas = await query.OrderBy(post => post.ProductName).Take(3).ToListAsync();

            res.Data = sortedDatas;
            return Ok(res);
        }

        [HttpGet("top/new/products")]
        public async Task<IActionResult> GetTopNewProducts()
        {
            var res = new ApiResult<IEnumerable<Product>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Products.AsNoTracking();
            var sortedDatas = await query.OrderBy(post => post.CreatedDate).Take(4).ToListAsync();

            res.Data = sortedDatas;
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

        [HttpGet("search/product/{name}")]
        public async Task<IActionResult> SearchProduct(string name)
        {
            var res = new ApiResult<IEnumerable<Product>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Products
                .Where(x => x.ProductName!.Contains(name));

            res.Data = await query.ToListAsync();
            return Ok(res);
        }


        [HttpGet("promotions")]
        public async Task<IActionResult> GetAllPromotions([FromQuery] ApiRequest request)
        {
            var res = new ApiResult<IEnumerable<Promotion>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Promotions.AsNoTracking();
            var sortedDatas = await query.OrderBy(post => post.PromotionName).ToListAsync();

            res.TotalRows = sortedDatas.Count;
            int skip = request.PageSize * (request.PageIndex - 1);
            res.Data = sortedDatas.Skip(skip).Take(request.PageSize);
            return Ok(res);
        }

        [HttpGet("promotions/available")]
        public async Task<IActionResult> GetAllPromotionsAvailable()
        {
            var res = new ApiResult<IEnumerable<Promotion>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Promotions.AsNoTracking();
            var now = DateTime.Now;

            var result = query.Where(x => x.StartDate < now && x.EndDate > now);
            var sortedDatas = await result.OrderBy(post => post.PromotionName).ToListAsync();

            res.Data = sortedDatas;
            return Ok(res);
        }

        [HttpGet("promotion/{id}")]
        public async Task<IActionResult> GetPromotion(string id)
        {
            var res = new ApiResult<Promotion>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.Promotions.AsNoTracking()
                .Where(x => x.Id == id);

            res.TotalRows = query.Count();
            res.Data = await query.FirstOrDefaultAsync();
            return Ok(res);
        }

        [HttpGet("carts")]
        public async Task<IActionResult> GetCarts()
        {
            var res = new ApiResult<CartDto>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");
            var cart = await _context.Carts
               .Include(x => x.CartDetails!)
               .ThenInclude(x => x.Product)
               .FirstOrDefaultAsync(x => x.UserId == userId);

            var cartDto = new CartDto
            {
                UserId = cart!.UserId,
                TotalPrice = cart.CartDetails!.Sum(x => x.Product!.Price * x.Quantity),
                CartDetails = cart.CartDetails!.Select(x => new CartDetailDto
                {
                    ProductId = x.ProductId,
                    Quantity = x.Quantity,
                    Price = x.Product!.Price,
                    ImageURL = x.Product.ImageURL,
                    ProductName = x.Product.ProductName
                }).ToList()
            };

            res.Data = cartDto;
            return Ok(res);
        }


        [HttpGet("order/status")]
        public async Task<IActionResult> GetAllOrderStatus()
        {
            var res = new ApiResult<IEnumerable<OrderStatus>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var query = _context.OrderStatus;
            res.Data = await query.ToListAsync();
            return Ok(res);
        }

        [HttpGet("statistics/{month}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetAllOrderOfYear(int month)
        {
            var res = new ApiResult<IEnumerable<StatisticsDto>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var year = DateTime.Today.Year;
            var query = _context.Orders
                .Where(x => x.OrderDate.Month == month && x.OrderDate.Year == year)
                .GroupBy(x => x.OrderDate.Day)
                .Select(x => new StatisticsDto
                {
                    Day = x.Key,
                    TotalRevenue = x.Sum(o => o.TotalCost),
                    TotalOrder = x.Count()
                });

            res.Data = await query.ToListAsync();

            return Ok(res);
        }

        [HttpGet("statistics/today")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> GetAllOrderOfDay()
        {
            var res = new ApiResult<OrderStatisticsDto>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var result = await Task.Run(() => _context.GetOrderStatisticsForToday());
            res.Data = result;

            return Ok(res);
        }

        [HttpGet("statistics")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetOrderRevenue()
        {
            var res = new ApiResult<IEnumerable<StatisticsDto>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var currentYear = DateTime.Now.Year;

            var query = _context.Orders
                .Where(x => x.OrderDate.Year == currentYear)
                .GroupBy(x => new { x.OrderDate.Month })
                .Select(x => new StatisticsDto
                {
                    Month = "Tháng " + x.Key.Month,
                    TotalRevenue = x.Sum(o => o.TotalCost),
                    TotalOrder = x.Count()
                });

            res.Data = await query.ToListAsync();
            return Ok(res);
        }

        [HttpGet("orders/user/{status}")]
        public async Task<IActionResult> GetAllOrdersUser(string status)
        {
            var res = new ApiResult<IEnumerable<GetOrderDto>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");
            var query = _context.Orders.Where(x => x.UserId == userId).AsNoTracking();

            var orders = await query
               .Include(x => x.OrderStatus)
               .Include(x => x.Promotion)
               .Include(x => x.OrderDetails!)
               .ThenInclude(x => x.Product)
               .OrderByDescending(x => x.OrderDate)
               .ToListAsync();

            switch (status)
            {
                case "all":; break;
                case "awaitingConfirmation":
                    orders = orders
                        .Where(x => x.OrderStatus!.OrderStatusName == "Chờ xác nhận").ToList(); break;
                case "shipping":
                    orders = orders
                   .Where(x => x.OrderStatus!.OrderStatusName == "Vận chuyển").ToList(); break;
                case "inTransit":
                    orders = orders
                       .Where(x => x.OrderStatus!.OrderStatusName == "Đang giao").ToList(); break;
                case "completed":
                    orders = orders
                       .Where(x => x.OrderStatus!.OrderStatusName == "Hoàn thành").ToList(); break;
                case "cancelled":
                    orders = orders
                       .Where(x => x.OrderStatus!.OrderStatusName == "Đã hủy").ToList(); break;
            }

            var orderDtos = orders.Select(cart => new GetOrderDto
            {
                Id = cart.Id,
                OrderStatusName = cart.OrderStatus!.OrderStatusName,
                DiscountPercent = cart.Promotion?.DiscountPercent ?? 0,
                TotalCost = cart.TotalCost,
                OrderDate = cart.OrderDate,
                GetOrderDetails = cart.OrderDetails!.Select(x => new GetOrderDetailDto
                {
                    ImageURL = x.Product!.ImageURL,
                    ProductName = x.Product.ProductName,
                    Quantity = x.Quantity,
                    UnitPrice = x.UnitPrice,
                    Price = x.Product.Price,
                }).ToList()
            });

            res.Data = orderDtos;
            return Ok(res);
        }

        [HttpGet("orders/{status}")]
        public async Task<IActionResult> GetAllOrders(string status)
        {
            var res = new ApiResult<IEnumerable<GetOrderDto>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");
            var query = _context.Orders;

            var orders = await query
               .Include(x => x.OrderStatus)
               .Include(x => x.Promotion)
               .Include(x => x.ApplicationUser)
               .Include(x => x.OrderDetails!)
               .ThenInclude(x => x.Product)
               .OrderByDescending(x => x.OrderDate)
               .ToListAsync();

            switch (status)
            {
                case "all":; break;
                case "awaitingConfirmation":
                    orders = orders
                        .Where(x => x.OrderStatus!.OrderStatusName == "Chờ xác nhận").ToList(); break;
                case "shipping":
                    orders = orders
                   .Where(x => x.OrderStatus!.OrderStatusName == "Vận chuyển").ToList(); break;
                case "inTransit":
                    orders = orders
                       .Where(x => x.OrderStatus!.OrderStatusName == "Đang giao").ToList(); break;
                case "completed":
                    orders = orders
                       .Where(x => x.OrderStatus!.OrderStatusName == "Hoàn thành").ToList(); break;
                case "cancelled":
                    orders = orders
                       .Where(x => x.OrderStatus!.OrderStatusName == "Đã hủy").ToList(); break;
            }


            var orderDtos = orders.Select(cart => new GetOrderDto
            {
                Id = cart.Id,
                OrderStatusName = cart.OrderStatus!.OrderStatusName,
                DiscountPercent = cart.Promotion?.DiscountPercent ?? 0,
                TotalCost = cart.TotalCost,
                OrderDate = cart.OrderDate,
                UserName = cart.ApplicationUser!.FirstName + " " + cart.ApplicationUser.LastName,
                Email = cart.ApplicationUser.Email,
                PhoneNumber = cart.ApplicationUser.PhoneNumber,
                Address = cart.ApplicationUser.Address,
                OrderStatusId = cart.OrderStatusId,
                GetOrderDetails = cart.OrderDetails!.Select(x => new GetOrderDetailDto
                {
                    ImageURL = x.Product!.ImageURL,
                    ProductName = x.Product.ProductName,
                    Quantity = x.Quantity,
                    UnitPrice = x.UnitPrice,
                    Price = x.Product.Price,
                }).ToList()
            });

            res.Data = orderDtos;
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

        [HttpPost("promotion")]
        public async Task<IActionResult> CreatePromotion(PromotionDto model)
        {
            var res = new ApiResult<IEnumerable<Promotion>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");

            Promotion createPromotion = new()
            {
                Id = Guid.NewGuid().ToString(),
                PromotionName = model.PromotionName,
                StartDate = model.StartDate.ToLocalTime(),
                EndDate = model.EndDate.ToLocalTime(),
                PromotionDescription = model.PromotionDescription,
                DiscountPercent = model.DiscountPercent,
                CreatedDate = model.CreatedDate.ToLocalTime(),
                CreatedByUserId = userId
            };

            try
            {
                _context.Add(createPromotion);
                await _context.SaveChangesAsync();
                res.Message = AppConsts.MSG_CREATED_SUCCESSFULL;

            }
            catch (Exception ex)
            {
                res.Successed = false;
                res.Message = ex.Message;
                res.ResponseCode = StatusCodes.Status500InternalServerError;
            }
            return Ok(res);
        }

        [HttpPost("cart")]
        public async Task<IActionResult> CreateCart(CartDetail model)
        {
            var res = new ApiResult<IEnumerable<Cart>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");
            var cartId = Guid.NewGuid().ToString();
            var cart = await _context.Carts.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId);

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                if (cart == null)
                {
                    Cart createCart = new()
                    {
                        Id = cartId,
                        UserId = userId,
                    };
                    _context.Add(createCart);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    cartId = cart.Id;
                }

                var cartDetail = await _context.CartDetails.AsNoTracking()
                    .FirstOrDefaultAsync(x => x.CartId == cartId && x.ProductId == model.ProductId);

                if (cartDetail == null)
                {
                    CartDetail createCartDetail = new()
                    {
                        CartId = cartId,
                        ProductId = model.ProductId,
                        Quantity = model.Quantity
                    };
                    _context.Add(createCartDetail);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    cartDetail.Quantity = cartDetail.Quantity + model.Quantity;
                    _context.Update(cartDetail);
                    await _context.SaveChangesAsync();
                }

                transaction.Commit();
                res.Message = AppConsts.MSG_CREATED_SUCCESSFULL;

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                res.Successed = false;
                res.Message = ex.Message;
                res.ResponseCode = StatusCodes.Status500InternalServerError;
            }

            return Ok(res);
        }

        [HttpPost("order")]
        public async Task<IActionResult> CreateOrder(OrderDto model)
        {
            var res = new ApiResult<IEnumerable<Cart>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");
            var orderId = Guid.NewGuid().ToString();
            List<OrderDetailDto> orderDetails = model.OrderItems;

            var createOrderDetail = new List<OrderDetail>();
            var cart = await _context.Carts.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId);
            var orderStatus = await _context.OrderStatus.AsNoTracking().FirstOrDefaultAsync(x => x.OrderStatusName == "Chờ xác nhận");

            Order createOrder = new()
            {
                Id = orderId,
                UserId = userId,
                TotalCost = model.TotalCost,
                OrderDate = model.OrderDate.ToLocalTime(),
                PromotionId = model.PromotionId,
                OrderStatusId = orderStatus!.Id
            };

            foreach (var item in orderDetails)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = orderId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPriceTemp
                };

                createOrderDetail.Add(orderDetail);
            }

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                _context.Add(createOrder);
                await _context.SaveChangesAsync();

                if (cart != null && orderDetails.Count > 1)
                {
                    var cartDetail = await _context.CartDetails.Where(x => x.CartId == cart.Id).ToListAsync();
                    _context.CartDetails.RemoveRange(cartDetail!);
                    await _context.SaveChangesAsync();
                    _context.Carts.Remove(cart);
                }

                _context.AddRange(createOrderDetail);
                await _context.SaveChangesAsync();

                transaction.Commit();
                res.Message = AppConsts.MSG_CREATED_SUCCESSFULL;
            }
            catch (Exception ex)
            {
                transaction.Rollback();

                res.Successed = false;
                res.Message = ex.Message;
                res.ResponseCode = StatusCodes.Status500InternalServerError;
            }


            return Ok(res);
        }

        [HttpPost("order/status")]
        public async Task<IActionResult> CreateOrderStatus(OrderStatus model)
        {
            var res = new ApiResult<IEnumerable<OrderStatus>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };


            OrderStatus createOrderStatus = new()
            {
                Id = Guid.NewGuid().ToString(),
                OrderStatusName = model.OrderStatusName
            };

            try
            {
                _context.Add(createOrderStatus);
                await _context.SaveChangesAsync();
                res.Message = AppConsts.MSG_CREATED_SUCCESSFULL;

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
        [Authorize(Policy = "Employee")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            var res = new ApiResult<IEnumerable<Categories>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            try
            {
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
            }
            catch (Exception ex)
            {
                res.Successed = false;
                res.Message = ex.ToString();
            }

            return Ok(res);
        }

        [HttpDelete("product/{id}")]
        [Authorize(Policy = "Employee")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            var res = new ApiResult<IEnumerable<Product>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            try
            {
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
            }
            catch (Exception ex)
            {
                res.Successed = false;
                res.Message = ex.ToString();
            }

            return Ok(res);
        }

        [HttpDelete("promotion/{id}")]
        [Authorize(Policy = "Employee")]
        public async Task<IActionResult> DeletePromotion(string id)
        {
            var res = new ApiResult<IEnumerable<Promotion>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            Promotion product = _context.Promotions.Find(id)!;


            try
            {
                _context.Promotions.Remove(product);
                await _context.SaveChangesAsync();
                res.Message = AppConsts.MSG_UPDATED_SUCCESSFULL;
            }
            catch (Exception ex)
            {
                res.Successed = false;
                res.Message = ex.ToString();
            }
            return Ok(res);
        }

        [HttpDelete("cart/{productId}")]
        [Authorize(Policy = "Employee")]
        public async Task<IActionResult> DeleteCart(string productId)
        {
            var res = new ApiResult<IEnumerable<Cart>>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");
            var cart = await _context.Carts.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId);
            var cartDetail = await _context.CartDetails.AsNoTracking().FirstOrDefaultAsync(x => x.CartId == cart!.Id && x.ProductId == productId);

            try
            {
                _context.CartDetails.Remove(cartDetail!);
                await _context.SaveChangesAsync();
                res.Message = AppConsts.MSG_UPDATED_SUCCESSFULL;
            }
            catch (Exception ex)
            {
                res.Successed = false;
                res.Message = ex.ToString();
            }
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
                string imageName = Path.GetFileName(category.ImageURL)!;
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", imageName);

                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }

                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = Guid.NewGuid().ToString() + fileExtension;

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
                string imageName = Path.GetFileName(product.ImageURL)!;
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", imageName);

                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }

                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = Guid.NewGuid().ToString() + fileExtension;

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

        [HttpPut("promotion/{id}")]
        public async Task<IActionResult> UpdatePromotion(UpdatePromotionDto promotionDto, string id)
        {
            var res = new ApiResult<bool>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var promotion = await _context.Promotions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

            if (promotion == null || promotionDto == null)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
                return Ok(res);
            }

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");

            promotion.PromotionName = promotionDto.PromotionName;
            promotion.StartDate = promotionDto.StartDate;
            promotion.EndDate = promotionDto.EndDate;
            promotion.PromotionDescription = promotionDto.PromotionDescription;
            promotion.DiscountPercent = promotionDto.DiscountPercent;
            promotion.ModifiedDate = DateTime.Parse(promotionDto.ModifiedDate.ToString()!).ToLocalTime();
            promotion.CreatedByUserId = userId;

            try
            {
                _context.Update(promotion);
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

        [HttpPut("cart/{productId}")]
        public async Task<IActionResult> UpdateCart(UpdateCartDto cartDto, string productId)
        {
            var res = new ApiResult<bool>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var userId = _httpContext.HttpContext!.User.FindFirstValue("id");
            var cart = await _context.Carts.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId);
            var cartDetail = await _context.CartDetails.AsNoTracking().FirstOrDefaultAsync(x => x.CartId == cart!.Id && x.ProductId == productId);

            if (cartDetail == null || cartDto == null || cart == null)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
                return Ok(res);
            }

            cartDetail.Quantity = cartDto.Quantity;

            try
            {
                _context.Update(cartDetail);
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

        [HttpPut("order/status/{orderId}")]
        [Authorize(Policy = "Employee")]
        public async Task<IActionResult> UpdateOderStatus(OrderStatusDto orderStatusDto, string orderId)
        {
            var res = new ApiResult<bool>
            {
                Successed = true,
                ResponseCode = StatusCodes.Status200OK,
            };

            var order = await _context.Orders.AsNoTracking().FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
            {
                res.Message = AppConsts.MSG_FIND_NOT_FOUND_DATA;
                return Ok(res);
            }

            order.OrderStatusId = orderStatusDto.OrderStatusId;

            try
            {
                _context.Update(order);
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
