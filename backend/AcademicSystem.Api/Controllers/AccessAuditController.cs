using AcademicSystem.Business.Services;
using AcademicSystem.Entities.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcademicSystem.Api.Controllers;

/// <summary>Provides a read-only, secretary-only view of access audit events.</summary>
[ApiController]
[Route("api/audit/accesses")]
[Authorize(Roles = RoleNames.AcademicSecretary)]
public sealed class AccessAuditController(IAccessAuditService auditService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AccessAuditEventDto>>> Get(
        [FromQuery] DateTimeOffset? from,
        [FromQuery] DateTimeOffset? to,
        [FromQuery] int? userId,
        CancellationToken cancellationToken)
    {
        if (from.HasValue && to.HasValue && from > to)
        {
            return BadRequest(new { message = "La fecha inicial no puede ser posterior a la fecha final." });
        }

        if (userId is <= 0)
        {
            return BadRequest(new { message = "El identificador del usuario debe ser mayor que cero." });
        }

        return Ok(await auditService.GetAsync(from, to, userId, cancellationToken));
    }
}
