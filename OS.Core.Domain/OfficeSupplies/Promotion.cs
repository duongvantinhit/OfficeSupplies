using OS.Core.Domain.SeedWork;

namespace OS.Core.Domain.OfficeSupplies
{
    public class Promotion : BaseEntity<string>
    {
        public string? PromotionName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? PromotionDescription { get; set; }
        public double DiscountPercent { get; set; }
        public string? CreatedByUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public ICollection<Order>? Orders { get; set; }
    }
}
