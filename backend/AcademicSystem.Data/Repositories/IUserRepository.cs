using AcademicSystem.Entities.DTOs;
using AcademicSystem.Entities.Models;

namespace AcademicSystem.Data.Repositories;

public interface IUserRepository
{
    User? GetActiveByEmail(string email);

    void SaveChanges();

    Task<List<UserResponseDto>> GetAllAsync(CancellationToken ct);

    Task<UserResponseDto?> GetByIdAsync(int id, CancellationToken ct);

    Task<User?> FindAsync(int id, CancellationToken ct);

    Task<User?> FindWithProfilesAsync(int id, CancellationToken ct);

    Task<string?> GetRoleNameAsync(int roleId, CancellationToken ct);

    Task<string?> GetRoleNameOfUserAsync(int userId, CancellationToken ct);

    Task<bool> CuilOrEmailExistsAsync(string cuil, string email, CancellationToken ct);

    Task<bool> CuilOrEmailExistsAsync(string cuil, string email, int excludeId, CancellationToken ct);

    Task<bool> HasStudentProfileAsync(int userId, CancellationToken ct);

    Task<bool> HasSecretaryProfileAsync(int userId, CancellationToken ct);

    Task<bool> HasTeacherProfileAsync(int userId, CancellationToken ct);

    Task<bool> StudentDniOrRecordNumberExistsAsync(string dni, string recordNumber, CancellationToken ct);

    Task<bool> RecordNumberExistsForOtherAsync(int userId, string recordNumber, CancellationToken ct);

    Task<bool> IsActiveWithRoleAsync(int userId, string roleName, CancellationToken ct);

    Task<bool> OtherActiveWithRoleExistsAsync(int userId, string roleName, CancellationToken ct);

    void Add(User user);

    Task SaveChangesAsync(CancellationToken ct);
}
