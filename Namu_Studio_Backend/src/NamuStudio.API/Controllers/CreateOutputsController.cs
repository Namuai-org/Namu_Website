using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NamuStudio.API.Common;
using NamuStudio.Application.Abstractions.Outputs;
using NamuStudio.Application.DTOs.Outputs;

namespace NamuStudio.API.Controllers;

[Authorize]
[EnableRateLimiting("api")]
[Route("api/v1/sessions/{sessionId:guid}/outputs")]
public class CreateOutputsController(ICreateOutputService outputService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(Guid sessionId, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await outputService.GetOutputsAsync(userId, sessionId, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid sessionId, [FromBody] CreateOutputRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await outputService.CreateOutputAsync(userId, sessionId, request, cancellationToken);
        return result.IsSuccess ? CreatedAtAction(nameof(Get), new { sessionId }, result.Value) : NotFound(new { message = result.Error });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid sessionId, Guid id, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await outputService.DeleteOutputAsync(userId, sessionId, id, cancellationToken);
        return result.IsSuccess ? NoContent() : NotFound(new { message = result.Error });
    }
}
