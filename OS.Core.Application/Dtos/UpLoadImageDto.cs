using Microsoft.AspNetCore.Http;

namespace OS.Core.Application.Dtos

{
    public class UpLoadImageDto
    {
        public string? CategoryName { get; set; }
        public string? ImageURL { get; set; }
        public string? CategoryDescription { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public IFormFile? File { get; set; }
    }
}
