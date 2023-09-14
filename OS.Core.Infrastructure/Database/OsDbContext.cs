using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OS.Core.Application.Dtos;
using OS.Core.Domain.OfficeSupplies;

namespace OS.Core.Infrastructure.Database
{
    public class OsDbContext : IdentityDbContext<ApplicationUser>
    {
        public OsDbContext(DbContextOptions<OsDbContext> opt) : base(opt)
        {

        }

        public OrderStatisticsDto GetOrderStatisticsForToday()
        {
            var statisticsDto = new OrderStatisticsDto();

            using (var command = this.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "GetOrderStatisticsForToday";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                this.Database.OpenConnection();

                using var reader = command.ExecuteReader();
                if (reader.Read())
                {
                    statisticsDto.TotalRevenue = reader.GetDouble(0);
                    statisticsDto.TotalOrder = reader.GetInt32(1);
                    statisticsDto.TotalCustomer = reader.GetInt32(2);
                }
            }

            return statisticsDto;
        }

        public List<TopProductDto> TopProduct()
        {
            var topProducts = new List<TopProductDto>();

            using (var command = this.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SP_TOP_PRODUCT";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                this.Database.OpenConnection();

                using var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var topProduct = new TopProductDto
                    {
                        Id = reader.GetString(0),
                        ProductName = reader.GetString(1),
                        ProductDescription = reader.GetString(2),
                        Price = reader.GetDouble(3),
                        ImageURL = reader.GetString(4),
                        Quantity = reader.GetInt32(5)
                    };

                    topProducts.Add(topProduct);
                }
            }

            return topProducts;
        }

        public DbSet<ApplicationUser> AppUsers { get; set; }
        public DbSet<AppRoles> AppRoles { get; set; }
        public DbSet<Categories> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartDetail> CartDetails { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<OrderStatus> OrderStatus { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<OrderDetail>()
                .HasKey(od => new { od.OrderId, od.ProductId });

            modelBuilder.Entity<CartDetail>()
                .HasKey(od => new { od.CartId, od.ProductId });

            modelBuilder.Entity<Cart>()
                 .HasMany(x => x.CartDetails)
                 .WithOne(x => x.Cart)
                 .HasForeignKey(x => x.CartId);

            modelBuilder.Entity<Product>()
                .HasMany(x => x.CartsDetail)
                .WithOne(x => x.Product)
                .HasForeignKey(x => x.ProductId);

            modelBuilder.Entity<Order>()
                 .HasMany(x => x.OrderDetails)
                 .WithOne(x => x.Order)
                 .HasForeignKey(x => x.OrderId);

            modelBuilder.Entity<Product>()
                .HasMany(x => x.OrderDetail)
                .WithOne(x => x.Product)
                .HasForeignKey(x => x.ProductId);

            modelBuilder.Entity<Promotion>()
                .HasMany(x => x.Orders)
                .WithOne(x => x.Promotion)
                .HasForeignKey(x => x.PromotionId);

            modelBuilder.Entity<OrderStatus>()
                .HasMany(x => x.Orders)
                .WithOne(x => x.OrderStatus)
                .HasForeignKey(x => x.OrderStatusId);

            modelBuilder.Entity<ApplicationUser>()
                .HasMany(x => x.Orders)
                .WithOne(x => x.ApplicationUser)
                .HasForeignKey(x => x.UserId);
        }
    }
}
