using AcademicSystem.Data.Repositories;
using AcademicSystem.Entities.DTOs;
using AcademicSystem.Entities.Models;
using Microsoft.AspNetCore.Identity;

namespace AcademicSystem.Business.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    private readonly PasswordHasher<User> passwordHasher = new();

    public Task<List<UserResponseDto>> GetAllAsync(CancellationToken ct) => userRepository.GetAllAsync(ct);

    public Task<UserResponseDto?> GetByIdAsync(int id, CancellationToken ct) => userRepository.GetByIdAsync(id, ct);

    public Task<string?> GetRoleNameAsync(int roleId, CancellationToken ct) => userRepository.GetRoleNameAsync(roleId, ct);

    public Task<bool> CuilOrEmailExistsAsync(string cuil, string email, CancellationToken ct) =>
        userRepository.CuilOrEmailExistsAsync(cuil, email, ct);

    public Task<bool> CuilOrEmailExistsAsync(string cuil, string email, int excludeId, CancellationToken ct) =>
        userRepository.CuilOrEmailExistsAsync(cuil, email, excludeId, ct);

    public Task<bool> HasStudentProfileAsync(int userId, CancellationToken ct) => userRepository.HasStudentProfileAsync(userId, ct);

    public Task<bool> HasSecretaryProfileAsync(int userId, CancellationToken ct) => userRepository.HasSecretaryProfileAsync(userId, ct);

    public Task<bool> HasTeacherProfileAsync(int userId, CancellationToken ct) => userRepository.HasTeacherProfileAsync(userId, ct);

    // Un estudiante necesita legajo para tener perfil. Si ya tiene perfil, puede venir vacío y se conserva el que tenía.
    public async Task<string?> ValidateRecordNumberAsync(string? recordNumber, int? userId, CancellationToken ct)
    {
        string? legajo = Clean(recordNumber);

        if (legajo is null)
        {
            bool tienePerfil = userId is int id && await userRepository.HasStudentProfileAsync(id, ct);
            return tienePerfil ? null : "El número de legajo es obligatorio para un estudiante.";
        }

        return legajo.Length > 20 ? "El número de legajo admite hasta 20 caracteres." : null;
    }

    // ¿El DNI o el legajo ya son de otro estudiante? Si el usuario ya tiene perfil, el DNI no cambia y solo se mira el legajo.
    public async Task<bool> StudentDataTakenAsync(string cuil, string? recordNumber, int? userId, CancellationToken ct)
    {
        string? legajo = Clean(recordNumber);

        if (userId is int id && await userRepository.HasStudentProfileAsync(id, ct))
        {
            return legajo is not null && await userRepository.RecordNumberExistsForOtherAsync(id, legajo, ct);
        }

        return await userRepository.StudentDniOrRecordNumberExistsAsync(DniFromCuil(cuil.Trim()), legajo ?? "", ct);
    }

    public async Task<bool> IsLastActiveSecretaryAsync(int userId, CancellationToken ct)
    {
        if (!await userRepository.IsActiveWithRoleAsync(userId, RoleNames.AcademicSecretary, ct))
        {
            return false;
        }

        return !await userRepository.OtherActiveWithRoleExistsAsync(userId, RoleNames.AcademicSecretary, ct);
    }

    public async Task<UserResponseDto> CreateAsync(UserRequestDto input, CancellationToken ct)
    {
        User user = new User
        {
            FirstName = input.FirstName.Trim(),
            LastName = input.LastName.Trim(),
            Cuil = input.Cuil.Trim(),
            BirthDate = input.BirthDate,
            Address = Clean(input.Address),
            RoleId = input.RoleId,
            Email = input.Email.Trim(),
            Phone = Clean(input.Phone),
            EmergencyContactPhone = Clean(input.EmergencyContactPhone),
            IsActive = true
        };

        user.PasswordHash = passwordHasher.HashPassword(user, input.Password!);

        string roleName = await GetRoleNameAsync(user.RoleId, ct) ?? "";
        EnsureProfile(user, roleName, input.RecordNumber);

        userRepository.Add(user);
        await userRepository.SaveChangesAsync(ct);

        return ToDto(user, roleName);
    }

    public async Task<UserResponseDto?> UpdateAsync(int id, UserRequestDto input, CancellationToken ct)
    {
        User? user = await userRepository.FindWithProfilesAsync(id, ct);

        if (user is null)
        {
            return null;
        }

        user.FirstName = input.FirstName.Trim();
        user.LastName = input.LastName.Trim();
        user.Cuil = input.Cuil.Trim();
        user.BirthDate = input.BirthDate;
        user.Address = Clean(input.Address);
        user.RoleId = input.RoleId;
        user.Email = input.Email.Trim();
        user.Phone = Clean(input.Phone);
        user.EmergencyContactPhone = Clean(input.EmergencyContactPhone);
        user.IsActive = input.IsActive;

        if (!string.IsNullOrWhiteSpace(input.Password))
        {
            user.PasswordHash = passwordHasher.HashPassword(user, input.Password);
        }

        string roleName = await GetRoleNameAsync(user.RoleId, ct) ?? "";
        EnsureProfile(user, roleName, input.RecordNumber);

        await userRepository.SaveChangesAsync(ct);

        return ToDto(user, roleName);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct)
    {
        User? user = await userRepository.FindAsync(id, ct);

        if (user is null)
        {
            return false;
        }

        user.IsActive = false;
        await userRepository.SaveChangesAsync(ct);

        return true;
    }

    // Cada usuario tiene el perfil de su rol: es lo que lo hace aparecer en las pantallas de Secretaría.
    private static void EnsureProfile(User user, string roleName, string? recordNumber)
    {
        switch (roleName)
        {
            case RoleNames.Student:
                string? legajo = Clean(recordNumber);

                if (user.Student is null)
                {
                    if (legajo is null)
                    {
                        throw new InvalidOperationException("No se puede crear el perfil de estudiante sin número de legajo.");
                    }

                    user.Student = new Student
                    {
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Dni = DniFromCuil(user.Cuil),
                        RecordNumber = legajo
                    };
                }
                else
                {
                    user.Student.FirstName = user.FirstName;
                    user.Student.LastName = user.LastName;

                    if (legajo is not null)
                    {
                        user.Student.RecordNumber = legajo;
                    }
                }

                break;

            case RoleNames.Teacher:
                user.Teacher ??= new Teacher();
                break;

            case RoleNames.AcademicSecretary:
                user.AcademicSecretary ??= new AcademicSecretary();
                break;

            case RoleNames.Director:
                user.Director ??= new Director();
                break;
        }
    }

    // El DNI son los ocho dígitos del medio del CUIL. Si empieza con cero, es un DNI de siete dígitos.
    private static string DniFromCuil(string cuil)
    {
        string dni = cuil.Substring(2, 8);
        return dni.StartsWith('0') ? dni.Substring(1) : dni;
    }

    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static UserResponseDto ToDto(User u, string roleName) =>
        new(u.Id, u.FirstName, u.LastName, u.Cuil, u.BirthDate, u.Address, u.RoleId, roleName,
            u.Email, u.Phone, u.EmergencyContactPhone, u.IsActive, u.Student?.RecordNumber);
}
