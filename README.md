# Sistema Académico — Instituto Superior Cura Gabriel Brochero

Proyecto de Prácticas Profesionalizantes. Sistema de gestión académica con dos tipos de usuario (**Secretario** y **Estudiante**), desarrollado por 4 equipos sobre una arquitectura común definida por la Mesa Técnica.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 8 (JavaScript) |
| Backend | ASP.NET Core 9 Web API (C#) |
| Base de datos | SQL Server + Entity Framework Core 9 |
| Autenticación | JWT (JSON Web Tokens) + BCrypt para contraseñas |

## Estructura del repositorio

```
Sistema-Academico/
├── .github/                             → configuración del repositorio en GitHub
│   ├── workflows/ci.yml                 → CI: compila backend y frontend en cada push y cada PR
│   ├── PULL_REQUEST_TEMPLATE.md         → plantilla de PR de equipo (hacia development)
│   ├── PULL_REQUEST_TEMPLATE/           → plantillas de promoción a testing y a production
│   └── CODEOWNERS                       → quién revisa cada parte del repositorio
├── .gitattributes                       → normaliza fines de línea entre Windows y Linux
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
└── docs/                                → documentación de la Mesa Técnica y de Git
    ├── mesa-tecnica.md                  → modelo de datos, entidades y convenciones
    ├── flujo-git.md                     → trabajo diario de cada equipo con Git
    ├── integracion-y-releases.md        → runbook del E1 para integrar y promover
    └── configuracion-github.md          → cómo queda configurado el repo en GitHub
```

**Todos los equipos trabajan dentro de esta misma estructura**: las entidades van en `Domain/Entidades`, la lógica en `Application/Servicios`, los endpoints en `Api/Controllers` y las pantallas en `frontend/src/paginas`.

## Cómo levantar el proyecto

### Requisitos

- .NET SDK 9
- Node.js 20.19 o superior (Vite 8 no arranca con versiones anteriores)
- SQL Server (Express alcanza) corriendo en la máquina

### 1. Traer el repositorio

```bash
git clone https://github.com/gonzaleztomi1978-design/Sistema-Academico.git
cd Sistema-Academico
```

Si te pide credenciales, la contraseña de GitHub no sirve: va un token personal ([cómo generarlo](docs/configuracion-github.md#9-problemas-frecuentes)). Si te rechaza por permisos, pedile al E1 que te invite como colaborador. Al clonar quedás parado en `production`, que es la rama por defecto: para trabajar tenés que pasarte a la rama de tu equipo, como se explica en [Flujo de trabajo de cada equipo](#flujo-de-trabajo-de-cada-equipo).

### 2. Backend

Parado en la raíz del repositorio:

```bash
cd backend
dotnet run --project SistemaAcademico.Api
```

La primera vez crea la base `SistemaAcademico` automáticamente (migraciones + datos iniciales). La API queda en **http://localhost:5000** y Swagger en **http://localhost:5000/swagger**.

> Si tu SQL Server no es `localhost\SQLEXPRESS`, ajustá la connection string en `backend/SistemaAcademico.Api/appsettings.json` (hay ejemplos comentados ahí). **No subas ese cambio al repo**: si necesitás una conexión distinta, avisá al E1.

### 3. Frontend

En **otra** terminal (dejá el backend corriendo en la primera), parado en la raíz del repositorio:

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
    e1 ─┐
    e2 ─┤
    e3 ─┼─ PR ─> development ─ PR ─> testing ─ PR ─> production
    e4 ─┘        (integración      (candidata       (estable, rama
                   diaria)          a probar)        por defecto)
```

- **`production`** es la **rama por defecto** del repositorio en GitHub y la versión estable: lo que está acá es lo que se muestra y se defiende.
- **`testing`** es la versión candidata: se prueba el sistema completo (backend + frontend) antes de darla por buena.
- **`development`** es la integración diaria: acá se junta todos los días lo que hacen los cuatro equipos.

| Rama | Para qué sirve | Quién pushea | De dónde entra el código |
|---|---|---|---|
| `production` | Versión estable y presentable. Rama por defecto del repositorio. | Nadie directo. | Solo por PR desde `testing`. Lo organiza y aprueba el E1. |
| `testing` | Versión candidata: se prueba completa antes de darla por buena. | Nadie directo. | Solo por PR desde `development`. |
| `development` | Integración diaria del trabajo de los cuatro equipos. | Nadie directo. | Solo por PR desde `e1`, `e2`, `e3` o `e4`. Lo mergea el E1. |
| `e1` | Trabajo del E1: login, usuarios, roles, permisos, integración. | Integrantes del E1, directo. | Commits del propio equipo. |
| `e2` | Trabajo del E2: inscripción a 1.º año, cursos-comisiones, docentes. | Integrantes del E2, directo. | Commits del propio equipo. |
| `e3` | Trabajo del E3: planes de estudio, materias, correlatividades. | Integrantes del E3, directo. | Commits del propio equipo. |
| `e4` | Trabajo del E4: inscripciones a 2.º/3.º, consulta de materias, correlativas. | Integrantes del E4, directo. | Commits del propio equipo. |

> Las ramas viejas (`main`, `desarrollo`, `equipo1-acceso`, `equipo2-secretaria`, `equipo3-gestion-academica`, `equipo4-inscripciones`) fueron renombradas a este esquema y ya no existen: usá siempre los nombres nuevos.

### Flujo de trabajo de cada equipo

```bash
# 1. Pararse en la rama del equipo y traer lo último
#    (la primera vez, git checkout e2 crea la rama local siguiendo a origin/e2)
git checkout e2
git pull origin e2

# 2. Antes de empezar algo nuevo, traer los cambios ya integrados en development.
#    El git fetch no es opcional: sin él, origin/development es la foto vieja
#    que bajaste la última vez y estarías mergeando código desactualizado.
git fetch origin
git merge origin/development
#    Si el merge marca conflictos: resolvelos en el editor, después
#    git add ARCHIVO-QUE-RESOLVISTE   y   git commit

# 3. Trabajar, revisar qué se va a subir, commitear y subir
git status
git add .
git commit -m "E2: inscripción de estudiantes a primer año"
git push origin e2

# 4. Cuando la funcionalidad está lista, abrir un Pull Request en GitHub:
#    base: development  <-  compare: e2
#    El E1 lo revisa y lo mergea. Si hay conflictos, te lo devuelve
#    para que los resuelvas en tu rama (repetís el paso 2 y pusheás).
```

> Mirá bien el `git status` del paso 3 antes del `git add .`. Si le cambiaste el `Server` a `backend/SistemaAcademico.Api/appsettings.json` para conectarte a tu SQL Server, ese archivo **no se sube**: agregá los tuyos uno por uno (`git add backend/SistemaAcademico.Application/... frontend/src/paginas/...`) en lugar de `git add .`. Si ya lo agregaste sin querer, sacalo del stage con `git restore --staged backend/SistemaAcademico.Api/appsettings.json` y commiteá de nuevo.

### Promoción entre ramas

El código sube siempre en el mismo orden y siempre por Pull Request. Lo maneja el E1:

1. **`development` → `testing`**: cuando lo integrado en `development` compila y funciona, el E1 abre un PR con base `testing` y compare `development`. Ahí se prueba el sistema completo.
2. **`testing` → `production`**: si la prueba salió bien, el E1 abre un PR con base `production` y compare `testing`. Ese PR lo aprueba el E1 antes de mergear.
3. **Si aparece un problema en `testing`**, no se arregla ahí: el equipo que corresponde lo corrige en su rama (`e1`..`e4`), vuelve a entrar por PR a `development` y se repite el paso 1.

El detalle paso a paso (qué verificar antes de cada promoción y cómo etiquetar) está en [`docs/integracion-y-releases.md`](docs/integracion-y-releases.md).

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
if (!respuesta) return;               // el token venció: apiFetch ya cerró la sesión y redirigió al login
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

1. **Nunca** pushear directo a `development`, `testing` ni `production`: a esas tres ramas se entra solo por Pull Request.
2. Las **entidades nuevas y las migraciones** se acuerdan antes con la Mesa Técnica (evita dos equipos creando tablas que chocan). Para crear una migración: `dotnet ef migrations add NombreMigracion --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api` (desde `backend/`).
3. No subir connection strings personales, claves ni `.env`.
4. Antes de abrir un PR, verificar que `dotnet build` (parado en `backend/`) y `npm run build` (parado en `frontend/`) pasen sin errores. Lo mismo lo vuelve a chequear solo el CI (`.github/workflows/ci.yml`) en cada push a tu rama y en cada PR: si el check sale en rojo, el PR no se mergea. `npm run lint` (oxlint) también corre, pero solo avisa, no bloquea.
5. Los conflictos de merge en los PR hacia `development` los resuelve el equipo autor en su propia rama, con ayuda del E1 si hace falta. No se resuelven desde el editor web de GitHub.
6. **Nada de `git push --force`** (ni `--force-with-lease`) sobre ramas compartidas: `development`, `testing`, `production` y las cuatro ramas de equipo. Reescribir historia le rompe el repo local a todos los demás. Si mandaste algo mal, se arregla con un commit nuevo o con `git revert`, y avisá al E1.

## Equipos

| Equipo | Responsabilidad | Rama |
|---|---|---|
| E1 — Acceso e Integración | Login, usuarios, roles, permisos, integración, Git, configuración | `e1` |
| E2 — Secretaría | Inscripción a 1.º año, cursos-comisiones, docentes | `e2` |
| E3 — Gestión Académica | Planes de estudio, materias, correlatividades | `e3` |
| E4 — Inscripciones | Inscripciones 2.º/3.º, consulta de materias, validación de correlativas | `e4` |

## Documentación

| Documento | De qué trata |
|---|---|
| [`docs/flujo-git.md`](docs/flujo-git.md) | Trabajo diario de cada equipo con Git: comandos, commits y Pull Requests. |
| [`docs/integracion-y-releases.md`](docs/integracion-y-releases.md) | Runbook del E1: cómo integrar en `development` y promover a `testing` y `production`. |
| [`docs/configuracion-github.md`](docs/configuracion-github.md) | Cómo queda configurado el repositorio en GitHub (rama por defecto, protecciones, permisos). |
| [`docs/mesa-tecnica.md`](docs/mesa-tecnica.md) | Modelo de datos, entidades acordadas y convenciones de código y API. |
