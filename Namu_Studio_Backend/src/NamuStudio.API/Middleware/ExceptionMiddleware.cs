using System.Net;
using System.Text.Json;
using FluentValidation;

namespace NamuStudio.API.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment environment)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException exception)
        {
            await WriteResponseAsync(context, HttpStatusCode.BadRequest, "ValidationError", exception.Message, LogLevel.Warning, exception);
        }
        catch (UnauthorizedAccessException exception)
        {
            await WriteResponseAsync(context, HttpStatusCode.Unauthorized, "Unauthorized", exception.Message, LogLevel.Warning, exception);
        }
        catch (KeyNotFoundException exception)
        {
            await WriteResponseAsync(context, HttpStatusCode.NotFound, "NotFound", exception.Message, LogLevel.Warning, exception);
        }
        catch (Exception exception)
        {
            var message = environment.IsDevelopment() ? exception.Message : "An unexpected error occurred.";
            await WriteResponseAsync(context, HttpStatusCode.InternalServerError, "ServerError", message, LogLevel.Error, exception);
        }
    }

    private async Task WriteResponseAsync(HttpContext context, HttpStatusCode statusCode, string type, string message, LogLevel logLevel, Exception exception)
    {
        var traceId = context.TraceIdentifier;
        logger.Log(logLevel, exception, "Request failed with {Type} traceId {TraceId}", type, traceId);
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";
        var payload = JsonSerializer.Serialize(new { type, message, traceId });
        await context.Response.WriteAsync(payload);
    }
}
