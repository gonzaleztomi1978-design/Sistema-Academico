using System.Data;
using System.Data.Common;
using AcademicSystem.Data.Context;
using AcademicSystem.Entities.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AcademicSystem.Data.Repositories;

public sealed class AccessAuditRepository(AcademicSystemContext context) : IAccessAuditRepository
{
    public async Task AddAsync(
        int? userId,
        string? userIdentifier,
        DateTimeOffset occurredAt,
        string? ipAddress,
        string module,
        string eventType,
        string result,
        CancellationToken cancellationToken = default)
    {
        var connection = context.Database.GetDbConnection();
        var openedHere = connection.State != ConnectionState.Open;
        if (openedHere)
        {
            await connection.OpenAsync(cancellationToken);
        }

        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText = """
                INSERT INTO dbo.AccessAuditEvents
                    (UserId, UserIdentifier, OccurredAt, IpAddress, Module, EventType, Result)
                VALUES
                    (COALESCE(@UserId,
                        (SELECT TOP (1) Id FROM dbo.Users WHERE Email = @UserIdentifier)),
                     @UserIdentifier, @OccurredAt, @IpAddress, @Module, @EventType, @Result);
                """;

            AddParameter(command, "@UserId", userId, DbType.Int32);
            AddParameter(command, "@UserIdentifier", userIdentifier, DbType.String, 255);
            AddParameter(command, "@OccurredAt", occurredAt, DbType.DateTimeOffset);
            AddParameter(command, "@IpAddress", ipAddress, DbType.String, 45);
            AddParameter(command, "@Module", module, DbType.String, 256);
            AddParameter(command, "@EventType", eventType, DbType.String, 30);
            AddParameter(command, "@Result", result, DbType.String, 30);
            await command.ExecuteNonQueryAsync(cancellationToken);
        }
        finally
        {
            if (openedHere)
            {
                await connection.CloseAsync();
            }
        }
    }

    public async Task<IReadOnlyList<AccessAuditEventDto>> GetAsync(
        DateTimeOffset? from,
        DateTimeOffset? to,
        int? userId,
        CancellationToken cancellationToken = default)
    {
        var connection = context.Database.GetDbConnection();
        var openedHere = connection.State != ConnectionState.Open;
        if (openedHere)
        {
            await connection.OpenAsync(cancellationToken);
        }

        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText = """
                SELECT e.Id, e.UserId,
                       COALESCE(NULLIF(LTRIM(RTRIM(CONCAT(u.FirstName, N' ', u.LastName))), N''),
                                NULLIF(e.UserIdentifier, N''),
                                CASE WHEN e.UserId IS NULL THEN N'Usuario desconocido'
                                     ELSE CONCAT(N'Usuario ', e.UserId) END) AS [User],
                       e.OccurredAt, e.IpAddress, e.Module, e.EventType, e.Result
                FROM dbo.AccessAuditEvents AS e
                LEFT JOIN dbo.Users AS u ON u.Id = e.UserId
                WHERE (@From IS NULL OR e.OccurredAt >= @From)
                  AND (@To IS NULL OR e.OccurredAt <= @To)
                  AND (@UserId IS NULL OR e.UserId = @UserId)
                ORDER BY e.OccurredAt DESC, e.Id DESC;
                """;

            AddParameter(command, "@From", from, DbType.DateTimeOffset);
            AddParameter(command, "@To", to, DbType.DateTimeOffset);
            AddParameter(command, "@UserId", userId, DbType.Int32);

            var results = new List<AccessAuditEventDto>();
            await using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                results.Add(new AccessAuditEventDto(
                    reader.GetInt32(0),
                    reader.IsDBNull(1) ? null : reader.GetInt32(1),
                    reader.GetString(2),
                    reader.GetFieldValue<DateTimeOffset>(3),
                    reader.IsDBNull(4) ? null : reader.GetString(4),
                    reader.GetString(5),
                    reader.GetString(6),
                    reader.GetString(7)));
            }

            return results;
        }
        finally
        {
            if (openedHere)
            {
                await connection.CloseAsync();
            }
        }
    }

    private static void AddParameter(DbCommand command, string name, object? value, DbType type, int? size = null)
    {
        var parameter = command.CreateParameter();
        parameter.ParameterName = name;
        parameter.DbType = type;
        parameter.Value = value ?? DBNull.Value;
        if (size is not null)
        {
            parameter.Size = size.Value;
        }
        command.Parameters.Add(parameter);
    }
}
