using Microsoft.EntityFrameworkCore;
using SistemaAcademico.Application.DTOs;
using SistemaAcademico.Domain.Entidades;
using SistemaAcademico.Infrastructure.Data;

namespace SistemaAcademico.Application.Servicios;

public class UsuarioService
{
    private readonly AppDbContext _db;

    public UsuarioService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<UsuarioDto>> ListarAsync()
    {
        var usuarios = await _db.Usuarios
            .Include(u => u.Rol)
            .OrderBy(u => u.Apellido).ThenBy(u => u.Nombre)
            .ToListAsync();
        return usuarios.Select(MapearDto).ToList();
    }

    public async Task<UsuarioDto?> ObtenerAsync(int id)
    {
        var usuario = await _db.Usuarios.Include(u => u.Rol).FirstOrDefaultAsync(u => u.Id == id);
        return usuario is null ? null : MapearDto(usuario);
    }

    public async Task<List<RolDto>> ListarRolesAsync()
    {
        return await _db.Roles
            .Include(r => r.RolPermisos).ThenInclude(rp => rp.Permiso)
            .OrderBy(r => r.Nombre)
            .Select(r => new RolDto
            {
                Id = r.Id,
                Nombre = r.Nombre,
                Descripcion = r.Descripcion,
                Permisos = r.RolPermisos.Select(rp => rp.Permiso.Codigo).OrderBy(c => c).ToList(),
            })
            .ToListAsync();
    }

    public async Task<UsuarioDto> CrearAsync(CrearUsuarioRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NombreUsuario))
            throw new ArgumentException("El nombre de usuario es obligatorio.");
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
            throw new ArgumentException("La contraseña debe tener al menos 8 caracteres.");
        if (await _db.Usuarios.AnyAsync(u => u.NombreUsuario == request.NombreUsuario))
            throw new ArgumentException("Ya existe un usuario con ese nombre de usuario.");
        if (await _db.Usuarios.AnyAsync(u => u.Email == request.Email))
            throw new ArgumentException("Ya existe un usuario con ese email.");

        var rol = await _db.Roles.FindAsync(request.RolId)
            ?? throw new ArgumentException("El rol indicado no existe.");

        var usuario = new Usuario
        {
            NombreUsuario = request.NombreUsuario.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Nombre = request.Nombre.Trim(),
            Apellido = request.Apellido.Trim(),
            Rol = rol,
        };

        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync();
        return MapearDto(usuario);
    }

    public async Task<UsuarioDto?> ActualizarAsync(int id, ActualizarUsuarioRequest request)
    {
        var usuario = await _db.Usuarios.Include(u => u.Rol).FirstOrDefaultAsync(u => u.Id == id);
        if (usuario is null)
            return null;

        if (await _db.Usuarios.AnyAsync(u => u.Email == request.Email && u.Id != id))
            throw new ArgumentException("Ya existe otro usuario con ese email.");

        var rol = await _db.Roles.FindAsync(request.RolId)
            ?? throw new ArgumentException("El rol indicado no existe.");

        usuario.Email = request.Email.Trim();
        usuario.Nombre = request.Nombre.Trim();
        usuario.Apellido = request.Apellido.Trim();
        usuario.Activo = request.Activo;
        usuario.Rol = rol;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            if (request.Password.Length < 8)
                throw new ArgumentException("La contraseña debe tener al menos 8 caracteres.");
            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        await _db.SaveChangesAsync();
        return MapearDto(usuario);
    }

    /// <summary>
    /// Baja lógica: el usuario queda inactivo y no puede iniciar sesión,
    /// pero se conserva el registro por trazabilidad.
    /// </summary>
    public async Task<bool> DesactivarAsync(int id)
    {
        var usuario = await _db.Usuarios.FindAsync(id);
        if (usuario is null)
            return false;

        usuario.Activo = false;
        await _db.SaveChangesAsync();
        return true;
    }

    private static UsuarioDto MapearDto(Usuario usuario) => new()
    {
        Id = usuario.Id,
        NombreUsuario = usuario.NombreUsuario,
        Email = usuario.Email,
        Nombre = usuario.Nombre,
        Apellido = usuario.Apellido,
        Activo = usuario.Activo,
        RolId = usuario.RolId,
        Rol = usuario.Rol.Nombre,
    };
}
