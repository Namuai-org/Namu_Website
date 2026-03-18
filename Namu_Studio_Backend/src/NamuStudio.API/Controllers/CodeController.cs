using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NamuStudio.API.Common;
using NamuStudio.Application.Abstractions.Code;
using NamuStudio.Application.DTOs.Code;

namespace NamuStudio.API.Controllers;

[Authorize]
[EnableRateLimiting("api")]
[Route("api/v1/sessions/{sessionId:guid}/code")]
public class CodeController(ICodeService codeService) : ControllerBase
{
    [HttpGet("project")]
    public async Task<IActionResult> GetProject(Guid sessionId, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await codeService.GetOrCreateProjectAsync(userId, sessionId, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost("project")]
    public async Task<IActionResult> CreateProject(Guid sessionId, [FromBody] CreateProjectRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await codeService.CreateProjectAsync(userId, sessionId, request, cancellationToken);
        return result.IsSuccess ? CreatedAtAction(nameof(GetProject), new { sessionId }, result.Value) : NotFound(new { message = result.Error });
    }

    [HttpGet("project/files")]
    public async Task<IActionResult> GetFiles(Guid sessionId, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await codeService.GetFilesAsync(userId, sessionId, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPut("project/files/{filename}")]
    public async Task<IActionResult> UpsertFile(Guid sessionId, string filename, [FromBody] UpsertFileRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await codeService.UpsertFileAsync(userId, sessionId, filename, request, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpDelete("project/files/{filename}")]
    public async Task<IActionResult> DeleteFile(Guid sessionId, string filename, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var result = await codeService.DeleteFileAsync(userId, sessionId, filename, cancellationToken);
        return result.IsSuccess ? NoContent() : NotFound(new { message = result.Error });
    }
}
