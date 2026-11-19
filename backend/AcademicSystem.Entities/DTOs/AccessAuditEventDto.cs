namespace AcademicSystem.Entities.DTOs;

public sealed record AccessAuditEventDto(
    int Id,
    int? UserId,
    string User,
    DateTimeOffset OccurredAt,
    string? IpAddress,
    string Module,
    string EventType,
    string Result);
