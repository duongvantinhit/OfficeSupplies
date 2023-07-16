using Microsoft.AspNetCore.Identity;
using OS.Core.Application.Dtos;

namespace OS.Core.Domain.Reponsitories
{
    public interface IAccountReponsitory
    {
        public Task<IdentityResult> SignUpAsync(Sigup model);
        public Task<TokenDto> SigInAsync(Sigin model);
        Task<IdentityResult> CreateRoleAsync(string roleName);
        Task<IdentityResult> AssignUserRoleAsync(string userId, string roleName);
    }
}
