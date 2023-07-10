using Microsoft.EntityFrameworkCore;
using OS.Core.Domain.OfficeSupplies;

namespace OS.Core.Infrastructure.Database
{
    public class OsDbContext : DbContext
    {
        public OsDbContext(DbContextOptions<OsDbContext>opt):base(opt) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Categories> Categories { get; set; }
    }
}
