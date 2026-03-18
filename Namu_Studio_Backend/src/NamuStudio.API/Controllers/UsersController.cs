using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NamuStudio.API.Common;
using NamuStudio.Application.Abstractions.Users;
using NamuStudio.Application.DTOs.Users;

namespace NamuStudio.API.Controllers;

[Authorize]
[EnableRateLimiting("api")]
public class UsersController(IUserService userService) : ApiController
{
    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
        => HandleResult(await userService.GetMeAsync(CurrentUserId, cancellationToken));

    [HttpPatch("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileRequest request, CancellationToken cancellationToken)
        => HandleResult(await userService.UpdateProfileAsync(CurrentUserId, request, cancellationToken));

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteMe([FromBody] DeleteAccountRequest request, CancellationToken cancellationToken)
        => HandleResult(await userService.DeleteMeAsync(CurrentUserId, request.Password, cancellationToken));
}
