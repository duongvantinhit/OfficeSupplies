using OS.Core.Domain.SeedWork;
using System.ComponentModel.DataAnnotations.Schema;

namespace OS.Core.Domain.OfficeSupplies
{
    [Table("Categories")]
    public class Categories : BaseEntity<int>
    {
        public string? CategoryName { get; set; }
        public string? ImageURL { get; set; }
        public string? CategoryDescription { get; set; }
        public string? CreatedByUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
