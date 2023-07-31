namespace OS.Core.Application.Dtos
{
    public class StatisticsDto
    {
        public int? Day { get; set; }
        public double TotalAmount { get; set; }
    }

    public class RevenueSatisticsDto
    {
        public int Day { get; set; }
        public string? Month { get; set; }
        public double TotalAmount { get; set; }
        public int TotalOrder { get; set; }
    }
}
