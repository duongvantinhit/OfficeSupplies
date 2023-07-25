namespace OS.Core.Application.Dtos
{
    public class BasePromotion
    {
        public string? PromotionName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? PromotionDescription { get; set; }
        public double DiscountPercent { get; set; }
        public string? CreatedByUserId { get; set; }
    }

    public class PromotionDto:BasePromotion
    {
        public DateTime CreatedDate { get; set; }
    }

    public class UpdatePromotionDto:BasePromotion
    {
        public DateTime ModifiedDate { get; set; }
    }
}
