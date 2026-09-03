namespace SistemaAcademico.Application.DTOs;

public class LoginRequest
{
    public string NombreUsuario { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UsuarioLogueadoDto Usuario { get; set; } = null!;
}

public class UsuarioLogueadoDto
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public List<string> Permisos { get; set; } = new();
}
