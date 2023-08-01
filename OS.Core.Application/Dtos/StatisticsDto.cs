namespace OS.Core.Application.Dtos
{
    public class StatisticsDto
    {
        public int Day { get; set; }
        public string? Month { get; set; }
        public double TotalRevenue { get; set; }
        public int TotalOrder { get; set; }
        public int TotalCustomer { get; set; }
    }
}
