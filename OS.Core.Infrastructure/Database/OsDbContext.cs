using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OS.Core.Domain.OfficeSupplies;

namespace OS.Core.Infrastructure.Database
{
    public class OsDbContext : IdentityDbContext<ApplicationUser>
    {
        public OsDbContext(DbContextOptions<OsDbContext>opt):base(opt) {
        
        }
        public DbSet<Categories> Categories { get; set; }
    }
}
