namespace OS.Core.Application.Dtos
{
    public class CartsDto
    {
        public string? Id { get; set; }
        public string? UserId { get; set; }
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
