using Microsoft.AspNetCore.Identity;
using OS.Core.Domain.OfficeSupplies;
using System.Security.Cryptography;
using System.Text;

public class CaesarPasswordHasher : PasswordHasher<ApplicationUser>
{
    public override string HashPassword(ApplicationUser user, string password)
    {
        var encryptedPassword = EncryptWith3DES(password, "S8B2E6wJg4Fp9vUq");
        return encryptedPassword;
    }

    public override PasswordVerificationResult VerifyHashedPassword(ApplicationUser user, string hashedPassword, string providedPassword)
    {
        var encryptedPassword = EncryptWith3DES(providedPassword, "S8B2E6wJg4Fp9vUq");

        if (encryptedPassword == hashedPassword)
        {
            return PasswordVerificationResult.Success;
        }
        else
        {
            return PasswordVerificationResult.Failed;
        }
    }

    private string EncryptWith3DES(string plainText, string key)
    {
        using (var des = TripleDES.Create())
        {
            des.Key = Encoding.UTF8.GetBytes(key); // Khóa bí mật, có thể thay đổi
            des.Mode = CipherMode.ECB; // Chế độ mã hóa
            des.Padding = PaddingMode.PKCS7; // Mã hóa với Padding

            using (var encryptor = des.CreateEncryptor())
            {
                var encryptedBytes = encryptor.TransformFinalBlock(Encoding.UTF8.GetBytes(plainText), 0, plainText.Length);
                return Convert.ToBase64String(encryptedBytes);
            }
        }
    }
}