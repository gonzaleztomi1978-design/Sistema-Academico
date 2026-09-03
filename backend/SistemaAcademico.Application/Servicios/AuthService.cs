using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SistemaAcademico.Application.DTOs;
using SistemaAcademico.Domain.Entidades;
using SistemaAcademico.Infrastructure.Data;

namespace SistemaAcademico.Application.Servicios;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    /// <summary>
    /// Valida las credenciales y devuelve el token JWT con los datos del usuario,
    /// o null si el usuario no existe, está inactivo o la contraseña es incorrecta.
    /// </summary>
    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var usuario = await _db.Usuarios
            .Include(u => u.Rol)
                .ThenInclude(r => r.RolPermisos)
                    .ThenInclude(rp => rp.Permiso)
            .FirstOrDefaultAsync(u => u.NombreUsuario == request.NombreUsuario && u.Activo);

        if (usuario is null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
            return null;

        var permisos = usuario.Rol.RolPermisos
            .Select(rp => rp.Permiso.Codigo)
            .OrderBy(c => c)
            .ToList();

        return new LoginResponse
        {
            Token = GenerarToken(usuario, permisos),
            Usuario = new UsuarioLogueadoDto
            {
                Id = usuario.Id,
                NombreUsuario = usuario.NombreUsuario,
                NombreCompleto = $"{usuario.Nombre} {usuario.Apellido}",
                Rol = usuario.Rol.Nombre,
                Permisos = permisos,
            },
        };
    }

    private string GenerarToken(Usuario usuario, List<string> permisos)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new(ClaimTypes.Name, usuario.NombreUsuario),
            new(ClaimTypes.Role, usuario.Rol.Nombre),
        };
        claims.AddRange(permisos.Select(p => new Claim("permiso", p)));

        var clave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Clave"]!));
        var credenciales = new SigningCredentials(clave, SecurityAlgorithms.HmacSha256);
        var minutos = double.Parse(_config["Jwt:ExpiraMinutos"] ?? "480");

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Emisor"],
            audience: _config["Jwt:Audiencia"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(minutos),
            signingCredentials: credenciales);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
