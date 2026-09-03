using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaAcademico.Application.DTOs;
using SistemaAcademico.Application.Servicios;

namespace SistemaAcademico.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    /// <summary>Inicia sesión y devuelve el token JWT con los datos del usuario.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var respuesta = await _authService.LoginAsync(request);
        if (respuesta is null)
            return Unauthorized(new { mensaje = "Usuario o contraseña incorrectos." });

        return Ok(respuesta);
    }

    /// <summary>Devuelve los datos del usuario autenticado según su token.</summary>
    [HttpGet("yo")]
    [Authorize]
    public IActionResult Yo()
    {
        return Ok(new
        {
            id = User.FindFirstValue(ClaimTypes.NameIdentifier),
            nombreUsuario = User.Identity!.Name,
            rol = User.FindFirstValue(ClaimTypes.Role),
            permisos = User.FindAll("permiso").Select(c => c.Value),
        });
    }
}
