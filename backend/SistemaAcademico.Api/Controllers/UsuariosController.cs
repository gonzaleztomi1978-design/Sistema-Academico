using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaAcademico.Application.DTOs;
using SistemaAcademico.Application.Servicios;

namespace SistemaAcademico.Api.Controllers;

[ApiController]
[Route("api/usuarios")]
[Authorize(Roles = "Secretario")]
public class UsuariosController : ControllerBase
{
    private readonly UsuarioService _usuarioService;

    public UsuariosController(UsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
        => Ok(await _usuarioService.ListarAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Obtener(int id)
    {
        var usuario = await _usuarioService.ObtenerAsync(id);
        return usuario is null
            ? NotFound(new { mensaje = "No existe un usuario con ese id." })
            : Ok(usuario);
    }

    [HttpGet("roles")]
    public async Task<IActionResult> ListarRoles()
        => Ok(await _usuarioService.ListarRolesAsync());

    [HttpPost]
    public async Task<IActionResult> Crear(CrearUsuarioRequest request)
    {
        try
        {
            var usuario = await _usuarioService.CrearAsync(request);
            return CreatedAtAction(nameof(Obtener), new { id = usuario.Id }, usuario);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Actualizar(int id, ActualizarUsuarioRequest request)
    {
        try
        {
            var usuario = await _usuarioService.ActualizarAsync(id, request);
            return usuario is null
                ? NotFound(new { mensaje = "No existe un usuario con ese id." })
                : Ok(usuario);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    /// <summary>Baja lógica: el usuario queda inactivo pero no se borra de la base.</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Desactivar(int id)
    {
        var ok = await _usuarioService.DesactivarAsync(id);
        return ok
            ? NoContent()
            : NotFound(new { mensaje = "No existe un usuario con ese id." });
    }
}
