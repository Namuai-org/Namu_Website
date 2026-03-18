using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using NamuStudio.Application.Common;

namespace NamuStudio.API.Common;

[ApiController]
[Route("api/v1/[controller]")]
public abstract class ApiController : ControllerBase
{
    protected Guid CurrentUserId => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    protected IActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess && result.Value is not null)
        {
            return Ok(result.Value);
        }

        if (result.IsNotFound)
        {
            return NotFound(new { message = result.Error });
        }

        if (result.IsUnauthorized)
        {
            return Unauthorized(new { message = result.Error });
        }

        if (result.IsForbidden)
        {
            return Forbid();
        }

        return BadRequest(new { message = result.Error });
    }

    protected IActionResult HandleResult(Result result)
    {
        if (result.IsSuccess)
        {
            return NoContent();
        }

        if (result.IsNotFound)
        {
            return NotFound(new { message = result.Error });
        }

        if (result.IsUnauthorized)
        {
            return Unauthorized(new { message = result.Error });
        }

        if (result.IsForbidden)
        {
            return Forbid();
        }

        return BadRequest(new { message = result.Error });
    }
}
