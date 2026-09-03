# Mesa Técnica — Documentación

Acá va la documentación transversal que define la Mesa Técnica. Cada punto se completa a medida que se acuerda.

## 1. Modelo de datos y DER

Entidades ya creadas por E1 (no tocar sin acordarlo):

- `Usuario` (Id, NombreUsuario, Email, PasswordHash, Nombre, Apellido, Activo, FechaCreacion, RolId)
- `Rol` (Id, Nombre, Descripcion)
- `Permiso` (Id, Codigo, Descripcion)
- `RolPermiso` (RolId, PermisoId) — relación muchos a muchos

Pendientes de definir (con equipo responsable):

- [ ] `Estudiante` — ¿E2? (relación 1 a 1 con Usuario)
- [ ] `Docente` — E2
- [ ] `Curso` / `Comision` — E2/E3
- [ ] `Materia` — E3
- [ ] `PlanDeEstudio` — E3
- [ ] `Correlatividad` — E3
- [ ] `Inscripcion` — E4

## 2. Convenciones acordadas

- Idioma del código: español (entidades, propiedades, servicios).
- Endpoints: `api/<recurso>` en plural y minúsculas (ej: `api/usuarios`, `api/materias`).
- Respuestas de error: `{ "mensaje": "..." }` con el código HTTP que corresponda (400, 401, 403, 404).
- Bajas: lógicas (campo `Activo`), no se borran registros.

## 3. Contratos de API

Documentar acá los endpoints que cada equipo expone y consume (o mantenerlos en Swagger). Ejemplo del formato:

| Método | Ruta | Rol | Descripción | Equipo |
|---|---|---|---|---|
| POST | /api/auth/login | público | Devuelve token JWT | E1 |
| GET | /api/auth/yo | autenticado | Datos del usuario logueado | E1 |
| GET/POST/PUT/DELETE | /api/usuarios | Secretario | ABM de usuarios | E1 |

## 4. Decisiones pendientes

- [ ] Definir DER completo antes de que E2/E3/E4 creen entidades.
- [ ] Repartir responsabilidad de `Curso`/`Comision` entre E2 y E3.
- [ ] Acordar estados de `Inscripcion` (pendiente / confirmada / rechazada).
