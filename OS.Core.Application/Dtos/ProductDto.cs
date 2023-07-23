using Microsoft.AspNetCore.Http;

namespace OS.Core.Application.Dtos
{
    public class BaseProduct
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
        public IFormFile? File { get; set; }
    }

    public class ProductDto: BaseProduct
    {
        public DateTime CreatedDate { get; set; }
    }

    public class UpdateProductDto: BaseProduct
    {
        public DateTime? ModifiedDate { get; set; }
    }
}
