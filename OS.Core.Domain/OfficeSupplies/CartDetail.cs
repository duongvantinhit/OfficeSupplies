using System.ComponentModel.DataAnnotations.Schema;

namespace OS.Core.Domain.OfficeSupplies
{
    [Table("CartDetails")]
    public class CartDetail
    {
        public string? CartId { get; set; }
        public string? ProductId { get; set; }
        public int Quantity { get; set; }
        public Cart? Cart { get; set; }
        public Product? Product { get; set; }
    }
}
