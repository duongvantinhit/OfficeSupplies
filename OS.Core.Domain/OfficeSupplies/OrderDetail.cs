using OS.Core.Domain.SeedWork;
using System.ComponentModel.DataAnnotations.Schema;

namespace OS.Core.Domain.OfficeSupplies
{
    [Table("OrderDetails")]
    public class OrderDetail
    {
        public string? OrderId { get; set; }
        public string? ProductId { get; set; }
        public int Quantity { get; set; }
        public double UnitPrice { get; set; }
    }
}
