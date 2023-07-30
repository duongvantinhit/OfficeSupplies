using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OS.Core.Domain.OfficeSupplies;

namespace OS.Core.Infrastructure.Database
{
    public class OsDbContext : IdentityDbContext<ApplicationUser>
    {
        public OsDbContext(DbContextOptions<OsDbContext> opt) : base(opt)
        {

        }

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
