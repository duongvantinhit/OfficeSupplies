using Microsoft.AspNetCore.Identity;
using OS.Core.Application.Dtos;
using OS.Core.Domain.OfficeSupplies;

namespace OS.Core.Domain.Reponsitories
{
    public interface IAccountReponsitory
    {
        public Task<IdentityResult> SignUpAsync(Sigup model);
        public Task<TokenDto> SigInAsync(Sigin model);
        public Task<string> GenerateAccessTokenAsync(string email, ApplicationUser user);
        public Task<string> GenerateRefreshTokenAsync();
        public Task<TokenDto> RefreshTokenAsync(string email, string refreshToken);
        public Task<IdentityResult> CreateRoleAsync(string roleName);
        public Task<IdentityResult> AssignUserRoleAsync(string userId, string roleName);
        public Task<UserDto> GetUserAsync(string userId);
    }
}
