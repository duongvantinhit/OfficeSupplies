using Microsoft.AspNetCore.Http;

namespace OS.Core.Application.Dtos

{
    public class BaseCategory
    {
        public string? CategoryName { get; set; }
        public string? ImageURL { get; set; }
        public string? CategoryDescription { get; set; }
        public string? CreatedByUserId { get; set; }
        public string? Parent { get; set; }
        public IFormFile? File { get; set; }
    }

    public class CategoryDto : BaseCategory
    {
        public DateTime CreatedDate { get; set; }
    }

    public class UpdateCategoryDto : BaseCategory
    {
        public DateTime? ModifiedDate { get; set; }
    }
}
