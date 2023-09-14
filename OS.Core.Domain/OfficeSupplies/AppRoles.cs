using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace OS.Core.Domain.OfficeSupplies
{
    //Thử nghiệm
    [Table("AspNetRoles")]
    public class AppRoles : IdentityRole
    {
        [NotMapped]
        public string? Discriminator { get; set; }
    }
}
