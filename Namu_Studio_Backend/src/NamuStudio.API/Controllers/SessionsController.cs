using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NamuStudio.API.Common;
using NamuStudio.Application.Abstractions.Sessions;
using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Sessions;
using NamuStudio.Core.Enums;

namespace NamuStudio.API.Controllers;

[Authorize]
[EnableRateLimiting("api")]
public class SessionsController(ISessionService sessionService) : ApiController
{
    [HttpGet]
    public async Task<IActionResult> GetSessions([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] StudioMode? mode = null, CancellationToken cancellationToken = default)
        => HandleResult(await sessionService.GetSessionsAsync(CurrentUserId, new PaginationParams(page, pageSize), mode, cancellationToken));

    [HttpPost]
    public async Task<IActionResult> CreateSession([FromBody] CreateSessionRequest request, CancellationToken cancellationToken)
    {
        var result = await sessionService.CreateSessionAsync(CurrentUserId, request, cancellationToken);
        if (!result.IsSuccess || result.Value is null)
        {
            return HandleResult(result);
        }

        return CreatedAtAction(nameof(GetSession), new { id = result.Value.Id }, result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetSession(Guid id, CancellationToken cancellationToken)
        => HandleResult(await sessionService.GetSessionAsync(CurrentUserId, id, cancellationToken));

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> UpdateSession(Guid id, [FromBody] UpdateSessionRequest request, CancellationToken cancellationToken)
        => HandleResult(await sessionService.UpdateSessionAsync(CurrentUserId, id, request, cancellationToken));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSession(Guid id, CancellationToken cancellationToken)
        => HandleResult(await sessionService.DeleteSessionAsync(CurrentUserId, id, cancellationToken));

    [HttpGet("{id:guid}/messages")]
    public async Task<IActionResult> GetMessages(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken cancellationToken = default)
        => HandleResult(await sessionService.GetMessagesAsync(CurrentUserId, id, new PaginationParams(page, pageSize), cancellationToken));

    [HttpPost("{id:guid}/messages")]
    public async Task<IActionResult> CreateMessage(Guid id, [FromBody] CreateMessageRequest request, CancellationToken cancellationToken)
    {
        var result = await sessionService.CreateMessageAsync(CurrentUserId, id, request, cancellationToken);
        if (!result.IsSuccess || result.Value is null)
        {
            return HandleResult(result);
        }

        return CreatedAtAction(nameof(GetMessages), new { id }, result.Value);
    }
}
