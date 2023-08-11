namespace OS.Core.Application.Dtos
{
    public class OrderDetailDto
    {
        public string? OrderId { get; set; }
        public string? ProductId { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public double UnitPriceTemp => Price * Quantity;
        public double UnitPrice { get; set; }
    }

    public class OrderDto
    {
        public string? UserId { get; set; }
        public double TotalCost { get; set; }
        public DateTime OrderDate { get; set; }
        public string? PromotionId { get; set; }
        public string? OrderStatusId { get; set; }
        public List<OrderDetailDto> OrderItems { get; set; } = new List<OrderDetailDto>();
    }

    public class GetOrderDto
    {
        public string? Id { get; set; }
        public string? OrderStatusName { get; set; }
        public string? OrderStatusId { get; set; }
        public double DiscountPercent { get; set; }
        public double TotalCost { get; set; }
        public double Subtotal { get; set; }
        public DateTime OrderDate { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public List<GetOrderDetailDto>? GetOrderDetails { get; set; }
    }

    public class GetOrderDetailDto
    {
        public string? ImageURL { get; set; }
        public string? ProductName { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public double UnitPriceTemp => Price * Quantity;
        public double UnitPrice { get; set; }
    }
}
