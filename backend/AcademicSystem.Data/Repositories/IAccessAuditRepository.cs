using AcademicSystem.Entities.DTOs;

namespace AcademicSystem.Data.Repositories;

public interface IAccessAuditRepository
{
    Task AddAsync(
        int? userId,
        string? userIdentifier,
        DateTimeOffset occurredAt,
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
