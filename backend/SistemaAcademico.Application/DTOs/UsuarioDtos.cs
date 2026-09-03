namespace SistemaAcademico.Application.DTOs;

public class UsuarioDto
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public bool Activo { get; set; }
    public int RolId { get; set; }
    public string Rol { get; set; } = string.Empty;
}

public class CrearUsuarioRequest
{
    public string NombreUsuario { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public int RolId { get; set; }
}

public class ActualizarUsuarioRequest
{
    public string Email { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public int RolId { get; set; }
    public bool Activo { get; set; } = true;

    /// <summary>Si viene vacío, la contraseña no se modifica.</summary>
    public string? Password { get; set; }
}

public class RolDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public List<string> Permisos { get; set; } = new();
}
