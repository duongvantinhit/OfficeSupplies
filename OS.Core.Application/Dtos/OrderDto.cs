namespace OS.Core.Application.Dtos
{
    public class OrderDetailDto
    {
        public string? OrderId { get; set; }
        public string? ProductId { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        private double _unitPrice;
        public double UnitPriceTemp => Price * Quantity;
        public double UnitPrice { get; set; }
    }

    public class OrderDto
    {
        public string? UserId { get; set; }
        public double TotalCost { get; set; }
        public DateTime OrderDate { get; set; }
        public string? PromotionId { get; set; }
        public List<OrderDetailDto> OrderItems { get; set; } = new List<OrderDetailDto>();
    }
}
