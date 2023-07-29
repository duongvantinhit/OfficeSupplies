using OS.Core.Domain.SeedWork;
using System.ComponentModel.DataAnnotations.Schema;

namespace OS.Core.Domain.OfficeSupplies
{
    [Table("OrderStatus")]
    public class OrderStatus : BaseEntity<string>
    {
        public string? OrderStatusName { get; set; }
    }
}
