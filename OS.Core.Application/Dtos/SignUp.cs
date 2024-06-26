﻿using System.ComponentModel.DataAnnotations;

namespace OS.Core.Application.Dtos
{
    public class SignUp
    {
        [Required]
        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        [Required, EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? ConfirmPassword { get; set; }
        public string? Address { get; set; }
        public string? Role { get; set; }
    }
}
