using Microsoft.AspNetCore.Identity;

namespace OS.Core.Domain.OfficeSupplies
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public ICollection<Order>? Orders { get; set; }
    }
}
