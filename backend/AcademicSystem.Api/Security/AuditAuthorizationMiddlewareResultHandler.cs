using AcademicSystem.Business.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AcademicSystem.Api.Security;

public sealed class AuditAuthorizationMiddlewareResultHandler(
    IServiceScopeFactory scopeFactory,
    ILogger<AuditAuthorizationMiddlewareResultHandler> logger) : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler defaultHandler = new();

    public async Task HandleAsync(
        RequestDelegate next,
        HttpContext context,
        AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizeResult)
    {
        // Solo se registra a quien tiene sesión y no tiene permiso. Un pedido sin token o con el token vencido
        // no se registra: pasa cada vez que la pantalla renueva la sesión y llenaría el registro de ruido.
        if (authorizeResult.Forbidden)
        {
            int? userId = int.TryParse(context.User.FindFirst("sub")?.Value, out var parsedUserId)
                ? parsedUserId
                : null;

            try
            {
                using var scope = scopeFactory.CreateScope();
                var auditService = scope.ServiceProvider.GetRequiredService<IAccessAuditService>();
                await auditService.RecordAsync(
                    userId,
                    userId?.ToString(),
                    context.Connection.RemoteIpAddress?.ToString(),
                    context.Request.Path.Value ?? "/",
                    "AccessDenied",
                    "Denied",
                    CancellationToken.None);
            }
            catch (Exception)
            {
                logger.LogWarning("No se pudo guardar un evento de acceso denegado.");
            }
        }

        await defaultHandler.HandleAsync(next, context, policy, authorizeResult);
    }
}
