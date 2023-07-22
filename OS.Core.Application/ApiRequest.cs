namespace OS.Core.Application
{
    public class ApiRequest
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public string? SortField { get; set; }
        public int? SortOrder { get; set; }
        public ApiRequest()
        {
            if (this.PageIndex <= 0) this.PageIndex = 1;
        }
    }
}
