using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using OS.Core.Domain.OfficeSupplies;
using System.Security.Cryptography;
using System.Text;

public class PasswordHasher : PasswordHasher<ApplicationUser>
{
    private readonly IConfiguration _configuration;

    public PasswordHasher(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public override string HashPassword(ApplicationUser user, string password)
    {
        var encryptedPassword = EncryptWith3DES(password);
        return encryptedPassword;
    }

    public override PasswordVerificationResult VerifyHashedPassword(ApplicationUser user, string hashedPassword, string providedPassword)
    {
        var encryptedPassword = EncryptWith3DES(providedPassword);

        if (encryptedPassword == hashedPassword)
        {
            return PasswordVerificationResult.Success;
        }
        else
        {
            return PasswordVerificationResult.Failed;
        }
    }

    private string EncryptWith3DES(string plainText)
    {
        using var des = TripleDES.Create();
        des.Key = Encoding.UTF8.GetBytes(_configuration["Password:Secret"]);
        des.Mode = CipherMode.ECB;
        des.Padding = PaddingMode.PKCS7;

        using var encryptor = des.CreateEncryptor();
        var encryptedBytes = encryptor.TransformFinalBlock(Encoding.UTF8.GetBytes(plainText), 0, plainText.Length);
        return Convert.ToBase64String(encryptedBytes);
    } 
}