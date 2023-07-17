﻿using Microsoft.AspNetCore.Identity;
using OS.Core.Application.Dtos;

namespace OS.Core.Domain.Reponsitories
{
    public interface IAccountReponsitory
    {
        public Task<IdentityResult> SignUpAsync(Sigup model);
        public Task<TokenDto> SigInAsync(Sigin model);
        public Task<TokenDto> RefreshTokenAsync(string email, string refreshToken);
        public Task<IdentityResult> CreateRoleAsync(string roleName);
        public Task<IdentityResult> AssignUserRoleAsync(string userId, string roleName);
    }
}