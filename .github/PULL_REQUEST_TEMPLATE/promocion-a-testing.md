## Promoción a `testing`

**compare `development`** → **base `testing`**

Este PR arma la **versión candidata**: lo que está integrado en `development` pasa a `testing` para probarse completo
antes de darlo por bueno. Lo abre y lo aprueba el E1.

## Qué entra en esta candidata

<!-- Listá lo que se mergeó desde cada rama de equipo desde la última promoción.
     Si un equipo no metió nada en este período, escribí "sin cambios". -->

| Equipo | Rama | Qué entra en esta candidata | PR |
|---|---|---|---|
| E1 — Acceso e Integración | `e1` | | #  |
| E2 — Secretaría | `e2` | | #  |
| E3 — Gestión Académica | `e3` | | #  |
| E4 — Inscripciones | `e4` | | #  |

Para ver rápido qué commits entran:

```bash
git fetch origin
git log --oneline origin/testing..origin/development
```

## Estado del CI

- [ ] El workflow **CI** de GitHub Actions terminó en verde sobre este PR (compila backend y frontend)

Si el CI falló o quedó pendiente, verificá a mano en tu máquina y contá acá qué pasó.
Parado en la raíz del repositorio, con la rama `development` actualizada:

```bash
cd backend
dotnet build
cd ../frontend
npm ci
npm run build
```

Resultado: <!-- verde / rojo + link al run o pegá el error -->

## Pruebas manuales

Se prueban con la base levantada desde cero y el frontend corriendo en http://localhost:5173.
Si un módulo todavía no existe en esta candidata, no borres el ítem: marcalo y escribile al lado
"N/A — sin pantallas todavía", así queda claro que no se olvidó de probar.

- [ ] **Login secretario** (`secretario` / `Secretario123`): entra y ve su menú
- [ ] **Login estudiante** (`estudiante` / `Estudiante123`): entra y ve su menú
- [ ] **Login con credenciales inválidas**: devuelve error y no deja pasar
- [ ] **Permisos por rol**: el estudiante no accede a pantallas ni endpoints de secretario (401/403, no pantalla en blanco)
- [ ] **Pantallas del E1**: usuarios, roles y permisos
- [ ] **Pantallas del E2**: inscripción a 1.º año, cursos-comisiones, docentes
- [ ] **Pantallas del E3**: planes de estudio, materias, correlatividades
- [ ] **Pantallas del E4**: consulta de materias, inscripción a 2.º/3.º, validación de correlativas
- [ ] **Base creada desde cero sin errores**: borrar la base y levantar el backend aplica todas las migraciones y el seed
- [ ] **Swagger responde** en http://localhost:5000/swagger y los endpoints de los 4 equipos aparecen listados

Para probar la base desde cero hace falta la herramienta `dotnet-ef`. Se instala una sola vez por máquina:

```bash
dotnet tool install --global dotnet-ef --version 9.0.*
```

Después, parado en `backend/` y con el backend **detenido**:

```bash
dotnet ef database drop --force --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api
dotnet run --project SistemaAcademico.Api
```

El `--force` evita que el comando te pregunte y se quede esperando una confirmación. Al levantar de nuevo,
la API aplica sola todas las migraciones y carga los datos iniciales (roles, permisos y usuarios de prueba).

## Riesgos conocidos

<!-- Qué quedó a medias, qué se sabe que puede fallar, qué no se pudo probar y por qué.
     Si no hay nada, escribí "ninguno detectado". No lo dejes vacío. -->

## Capturas / evidencia

<!-- Capturas de las pantallas probadas y del Swagger levantado. -->
