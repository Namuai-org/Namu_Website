using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace NamuStudio.API.Filters;

public class ValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.ModelState.IsValid)
        {
            return;
        }

        var errors = context.ModelState
            .Where(entry => entry.Value?.Errors.Count > 0)
            .ToDictionary(
                entry => char.ToLowerInvariant(entry.Key[0]) + entry.Key[1..],
                entry => entry.Value!.Errors.Select(error => error.ErrorMessage).ToArray());

        context.Result = new BadRequestObjectResult(new
        {
            type = "ValidationError",
            errors
        });
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}
