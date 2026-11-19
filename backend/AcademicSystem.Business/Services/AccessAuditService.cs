using AcademicSystem.Data.Repositories;
using AcademicSystem.Entities.DTOs;
using Microsoft.Extensions.Logging;

namespace AcademicSystem.Business.Services;

public sealed class AccessAuditService(
    IAccessAuditRepository repository,
    ILogger<AccessAuditService> logger) : IAccessAuditService
{
    public async Task RecordAsync(
        int? userId,
        string? userIdentifier,
        string? ipAddress,
        string module,
        string eventType,
        string result,
        CancellationToken cancellationToken = default)
    {
        // Un identificador vacío se guarda como nulo, para que la consulta lo muestre como usuario desconocido.
        userIdentifier = string.IsNullOrWhiteSpace(userIdentifier) ? null : Limit(userIdentifier.Trim(), 255);
        ipAddress = Limit(ipAddress, 45);
        module = Limit(module, 256) ?? "/";

        try
        {
            await repository.AddAsync(
                userId,
                userIdentifier,
                DateTimeOffset.UtcNow,
                ipAddress,
                module,
                eventType,
                result,
                cancellationToken);
        }
        catch (Exception)
        {
            // A failed audit write must not block authentication or the original authorization response.
            // Keep the diagnostic free of request data, credentials, tokens, and exception details.
            logger.LogWarning("No se pudo guardar un evento de auditoría de tipo {EventType}.", eventType);
        }
    }

    public Task<IReadOnlyList<AccessAuditEventDto>> GetAsync(
        DateTimeOffset? from,
        DateTimeOffset? to,
        int? userId,
        CancellationToken cancellationToken = default) =>
        repository.GetAsync(from, to, userId, cancellationToken);

    private static string? Limit(string? value, int maxLength) =>
        value is null || value.Length <= maxLength ? value : value[..maxLength];
}
