using OS.Core.Domain.SeedWork;
using System.ComponentModel.DataAnnotations.Schema;

namespace OS.Core.Domain.OfficeSupplies
{

    [Table("Carts")]
    public class Cart : BaseEntity<string>
    {
        public string? UserId { get; set; }
        public string? ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
