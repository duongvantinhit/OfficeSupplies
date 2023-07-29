using System.ComponentModel.DataAnnotations;

namespace OS.Core.Application.Dtos
{
    public class SignIn
    {
        [Required, EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}
