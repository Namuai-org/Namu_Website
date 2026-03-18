using System.Diagnostics;
using System.Security.Claims;

namespace NamuStudio.API.Middleware;

public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/health"))
        {
            await next(context);
            return;
        }

        var stopwatch = Stopwatch.StartNew();
        await next(context);
        stopwatch.Stop();

        logger.LogInformation(
            "HTTP request completed {@RequestLog}",
            new
            {
                method = context.Request.Method,
                path = context.Request.Path.Value,
                statusCode = context.Response.StatusCode,
                durationMs = stopwatch.ElapsedMilliseconds,
                userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier)
            });
    }
}
