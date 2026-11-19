using AcademicSystem.Entities.DTOs;

namespace AcademicSystem.Business.Services;

public interface IAccessAuditService
{
    Task RecordAsync(
        int? userId,
        string? userIdentifier,
        string? ipAddress,
        string module,
        string eventType,
        string result,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AccessAuditEventDto>> GetAsync(
        DateTimeOffset? from,
        DateTimeOffset? to,
        int? userId,
        CancellationToken cancellationToken = default);
}
