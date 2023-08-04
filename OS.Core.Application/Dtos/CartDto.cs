namespace OS.Core.Application.Dtos
{
    public class CartDto
    {
        public string? UserId { get; set; }
        public double TotalPrice { get; set; }
        public List<CartDetailDto>? CartDetails { get; set; }
    }

    public class CartDetailDto
    {
        public string? ProductId { get; set; }
        public int Quantity { get; set; }
        public string? ProductName { get; set; }
        public string? ImageURL { get; set; }
        public double Price { get; set; }
    }

    public class UpdateCartDto
    {
        public int Quantity { get; set; }
    }
}
