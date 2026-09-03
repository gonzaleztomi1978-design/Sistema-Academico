using SistemaAcademico.Domain.Entidades;

namespace SistemaAcademico.Infrastructure.Data;

/// <summary>
/// Carga los datos iniciales (roles, permisos y usuarios de prueba)
/// la primera vez que se levanta la aplicación con la base vacía.
/// </summary>
public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Roles.Any())
            return;

        var permisos = new Dictionary<string, Permiso>
        {
            // E1 — Acceso
            ["usuarios.gestionar"] = new() { Codigo = "usuarios.gestionar", Descripcion = "Gestionar usuarios, roles y permisos" },
            // E2 — Secretaría
            ["estudiantes.inscribir_primero"] = new() { Codigo = "estudiantes.inscribir_primero", Descripcion = "Inscribir estudiantes a 1.º año" },
            ["estudiantes.ver_por_curso"] = new() { Codigo = "estudiantes.ver_por_curso", Descripcion = "Ver estudiantes por curso-comisión" },
            ["docentes.asignar_materias"] = new() { Codigo = "docentes.asignar_materias", Descripcion = "Asignar materias a docentes" },
            // E3 — Gestión Académica
            ["planes.gestionar"] = new() { Codigo = "planes.gestionar", Descripcion = "Administrar planes de estudio y materias" },
            ["correlatividades.gestionar"] = new() { Codigo = "correlatividades.gestionar", Descripcion = "Definir correlatividades entre materias" },
            // E4 — Inscripciones
            ["materias.consultar"] = new() { Codigo = "materias.consultar", Descripcion = "Consultar materias disponibles" },
            ["inscripciones.crear"] = new() { Codigo = "inscripciones.crear", Descripcion = "Inscribirse a materias" },
            ["inscripciones.consultar"] = new() { Codigo = "inscripciones.consultar", Descripcion = "Consultar inscripciones propias" },
        };
        db.Permisos.AddRange(permisos.Values);

        var rolSecretario = new Rol { Nombre = "Secretario", Descripcion = "Personal de secretaría del instituto" };
        var rolEstudiante = new Rol { Nombre = "Estudiante", Descripcion = "Estudiante del instituto" };
        db.Roles.AddRange(rolSecretario, rolEstudiante);

        string[] permisosSecretario =
        [
            "usuarios.gestionar",
            "estudiantes.inscribir_primero",
            "estudiantes.ver_por_curso",
            "docentes.asignar_materias",
            "planes.gestionar",
            "correlatividades.gestionar",
        ];
        string[] permisosEstudiante =
        [
            "materias.consultar",
            "inscripciones.crear",
            "inscripciones.consultar",
        ];

        foreach (var codigo in permisosSecretario)
            db.RolesPermisos.Add(new RolPermiso { Rol = rolSecretario, Permiso = permisos[codigo] });
        foreach (var codigo in permisosEstudiante)
            db.RolesPermisos.Add(new RolPermiso { Rol = rolEstudiante, Permiso = permisos[codigo] });

        db.Usuarios.AddRange(
            new Usuario
            {
                NombreUsuario = "secretario",
                Email = "secretario@brochero.edu.ar",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Secretario123"),
                Nombre = "Ana",
                Apellido = "Secretaría",
                Rol = rolSecretario,
            },
            new Usuario
            {
                NombreUsuario = "estudiante",
                Email = "estudiante@brochero.edu.ar",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Estudiante123"),
                Nombre = "Juan",
                Apellido = "Pérez",
                Rol = rolEstudiante,
            });

        db.SaveChanges();
    }
}
