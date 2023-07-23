using OS.Core.Domain.SeedWork;
using System.ComponentModel.DataAnnotations.Schema;

namespace OS.Core.Domain.OfficeSupplies
{
    [Table("Products")]
    public class Product : BaseEntity<string>
    {
        public string? ProductName { get; set; }
        public int QuantityInStock { get; set; }
        public string? CategoryId { get; set; }
        public string? Trademark { get; set; }
        public string? ProductDescription { get; set; }
        public double Price { get; set; }
        public string? ImageURL { get; set; }
        public string? Status { get; set; }
        public string? CountryOfOrigin { get; set; }
        public string? Warranty { get; set; }
        public string? WarrantyDescription { get; set; }
        public string? CreatedByUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
