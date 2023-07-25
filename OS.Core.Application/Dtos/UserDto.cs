namespace OS.Core.Application.Dtos
{
    public class UserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public List<string>? Roles { get; set; }
        public string? Address { get; set; }
        public string? Id { get; set; }
    }
}
