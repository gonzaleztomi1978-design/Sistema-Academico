# Sistema Académico — Instituto Superior Cura Gabriel Brochero

Proyecto de Prácticas Profesionalizantes. Sistema de gestión académica con dos tipos de usuario (**Secretario** y **Estudiante**), desarrollado por 4 equipos sobre una arquitectura común definida por la Mesa Técnica.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite (JavaScript) |
| Backend | ASP.NET Core 9 Web API (C#) |
| Base de datos | SQL Server + Entity Framework Core 9 |
| Autenticación | JWT (JSON Web Tokens) + BCrypt para contraseñas |

## Estructura del repositorio

```
sistema-academico/
├── backend/
│   ├── SistemaAcademico.sln
│   ├── SistemaAcademico.Api/            → Controllers (capa API)
│   ├── SistemaAcademico.Application/    → Servicios y DTOs (capa Application)
│   ├── SistemaAcademico.Domain/         → Entidades (capa Domain)
│   └── SistemaAcademico.Infrastructure/ → DbContext, migraciones y seed (capa Infrastructure)
├── frontend/                            → React + Vite
│   └── src/
│       ├── api.js                       → login, sesión y apiFetch (usar SIEMPRE para llamar a la API)
│       ├── paginas/                     → pantallas
│       └── componentes/                 → componentes compartidos (RutaProtegida)
└── docs/                                → documentación de la Mesa Técnica (DER, convenciones, APIs)
```

**Todos los equipos trabajan dentro de esta misma estructura**: las entidades van en `Domain/Entidades`, la lógica en `Application/Servicios`, los endpoints en `Api/Controllers` y las pantallas en `frontend/src/paginas`.

## Cómo levantar el proyecto

### Requisitos

- .NET SDK 9
- Node.js 20 o superior
- SQL Server (Express alcanza) corriendo en la máquina

### 1. Backend

```bash
cd backend
dotnet run --project SistemaAcademico.Api
```

La primera vez crea la base `SistemaAcademico` automáticamente (migraciones + datos iniciales). La API queda en **http://localhost:5000** y Swagger en **http://localhost:5000/swagger**.

> Si tu SQL Server no es `localhost\SQLEXPRESS`, ajustá la connection string en `backend/SistemaAcademico.Api/appsettings.json` (hay ejemplos comentados ahí). **No subas ese cambio al repo**: si necesitás una conexión distinta, avisá al E1.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Queda en **http://localhost:5173**.

### Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `secretario` | `Secretario123` | Secretario |
| `estudiante` | `Estudiante123` | Estudiante |

## Estrategia de ramas

```
main        ──●──────────────────────●──── versión estable, siempre funcionando
               \                    / (PR aprobado por E1)
desarrollo  ────●───●───●───●───●──●────── rama de integración
                 \   \ / \ / \ /
equipo2 ──────────●───●   │   │            cada equipo trabaja en su rama
equipo3 ──────────────────●   │
equipo4 ──────────────────────●
```

| Rama | Uso | ¿Quién pushea? |
|---|---|---|
| `main` | Solo versiones estables e integradas del sistema. | Nadie directo. Solo PR de `desarrollo` → `main`, aprobado por E1. |
| `desarrollo` | Rama de integración: acá se junta el trabajo de todos. | Nadie directo. Solo PR de `equipoX` → `desarrollo`. |
| `equipo1-acceso` | Trabajo del E1 (login, usuarios, integración). | Integrantes del E1. |
| `equipo2-secretaria` | Trabajo del E2 (inscripción 1.º, docentes). | Integrantes del E2. |
| `equipo3-gestion-academica` | Trabajo del E3 (planes, correlatividades). | Integrantes del E3. |
| `equipo4-inscripciones` | Trabajo del E4 (inscripciones 2.º/3.º). | Integrantes del E4. |

### Flujo de trabajo de cada equipo

```bash
# 1. Pararse en la rama del equipo y traer lo último
git checkout equipo2-secretaria
git pull origin equipo2-secretaria

# 2. Antes de empezar algo nuevo, traer los cambios integrados en desarrollo
git merge origin/desarrollo

# 3. Trabajar, commitear y subir
git add .
git commit -m "E2: inscripción de estudiantes a primer año"
git push origin equipo2-secretaria

# 4. Cuando la funcionalidad está lista, abrir un Pull Request en GitHub:
#    base: desarrollo  <-  compare: equipo2-secretaria
#    El E1 lo revisa, resuelve conflictos si hay, y lo mergea.
```

### Convención de commits

`EQUIPO: descripción corta en presente` — por ejemplo:

- `E1: agrega endpoint de login con JWT`
- `E3: CRUD de plan de estudios`
- `E2: corrige validación de DNI duplicado`

## Cómo usar la autenticación desde tu módulo

### En el backend (C#)

Decorá tu controller o acción con `[Authorize]`:

```csharp
[Authorize]                        // requiere estar logueado
[Authorize(Roles = "Secretario")]  // requiere además el rol Secretario
[Authorize(Roles = "Estudiante")]  // requiere el rol Estudiante
```

El id del usuario logueado sale de `User.FindFirstValue(ClaimTypes.NameIdentifier)` (útil por ejemplo para que E4 sepa qué estudiante se está inscribiendo).

### En el frontend (React)

- Envolvé tu página en `<RutaProtegida>` al declarar la ruta en `App.jsx`.
- Llamá a la API con `apiFetch` de `src/api.js` (agrega el token solo y maneja la expiración):

```js
import { apiFetch, tienePermiso } from "../api.js";

const respuesta = await apiFetch("/materias");
const materias = await respuesta.json();

if (tienePermiso("inscripciones.crear")) { /* mostrar botón */ }
```

### Permisos definidos

| Código | Módulo |
|---|---|
| `usuarios.gestionar` | E1 |
| `estudiantes.inscribir_primero`, `estudiantes.ver_por_curso`, `docentes.asignar_materias` | E2 |
| `planes.gestionar`, `correlatividades.gestionar` | E3 |
| `materias.consultar`, `inscripciones.crear`, `inscripciones.consultar` | E4 |

## Reglas para no rompernos el proyecto entre todos

1. **Nunca** pushear directo a `main` ni a `desarrollo`.
2. Las **entidades nuevas y las migraciones** se acuerdan antes con la Mesa Técnica (evita dos equipos creando tablas que chocan). Para crear una migración: `dotnet ef migrations add NombreMigracion --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api` (desde `backend/`).
3. No subir connection strings personales, claves ni `.env`.
4. Antes de abrir un PR, verificar que `dotnet build` y `npm run build` pasen sin errores.
5. Los conflictos de merge en los PR hacia `desarrollo` los resuelve el E1 junto con el equipo autor.

## Equipos

| Equipo | Responsabilidad | Rama |
|---|---|---|
| E1 — Acceso e Integración | Login, usuarios, roles, permisos, integración, Git, configuración | `equipo1-acceso` |
| E2 — Secretaría | Inscripción a 1.º año, cursos-comisiones, docentes | `equipo2-secretaria` |
| E3 — Gestión Académica | Planes de estudio, materias, correlatividades | `equipo3-gestion-academica` |
| E4 — Inscripciones | Inscripciones 2.º/3.º, consulta de materias, validación de correlativas | `equipo4-inscripciones` |
