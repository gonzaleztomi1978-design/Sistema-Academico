# Flujo de trabajo con Git — E1, E2, E3 y E4

Este es el manual del día a día. Si te sentás a laburar en el Sistema Académico y no te acordás qué comando va, abrí este archivo y seguí los pasos de arriba hacia abajo.

Vale para los cuatro equipos. Los ejemplos están escritos con la rama `e2`: si sos del E1, E3 o E4, cambiá `e2` por `e1`, `e3` o `e4` y listo.

> Las ramas `main`, `desarrollo`, `equipo1-acceso`, `equipo2-secretaria`, `equipo3-gestion-academica` y `equipo4-inscripciones` **ya no existen**. Fueron renombradas. Si ves un comando viejo con esos nombres, está desactualizado.

---

## 1. El modelo de ramas

```
   e1 ──┐
        │
   e2 ──┤
        ├── PR ──> development ── PR ──> testing ── PR ──> production
   e3 ──┤        (integración)          (candidata)       (estable)
        │
   e4 ──┘
```

El código siempre viaja en una sola dirección: de la rama de tu equipo hacia `development`, de ahí a `testing` y recién después a `production`. Nunca al revés, y **nunca salteando un escalón**.

| Rama | Para qué sirve | Quién pushea | Cómo entra el código |
|---|---|---|---|
| `e1` | Trabajo diario del E1 (login, usuarios, roles, permisos, integración). | Integrantes del E1, directo. | `git push origin e1` |
| `e2` | Trabajo diario del E2 (inscripción a 1.º, cursos-comisiones, docentes). | Integrantes del E2, directo. | `git push origin e2` |
| `e3` | Trabajo diario del E3 (planes de estudio, materias, correlatividades). | Integrantes del E3, directo. | `git push origin e3` |
| `e4` | Trabajo diario del E4 (inscripciones a 2.º/3.º, consulta de materias, correlativas). | Integrantes del E4, directo. | `git push origin e4` |
| `development` | Integración diaria: acá se junta el trabajo de los cuatro equipos. | **Nadie directo.** | Solo por Pull Request desde `e1`, `e2`, `e3` o `e4`. Lo mergea el E1. |
| `testing` | Versión candidata: se prueba el sistema completo antes de darlo por bueno. | **Nadie directo.** | Solo por Pull Request desde `development`. |
| `production` | Versión estable y presentable. Es la rama por defecto del repositorio. | **Nadie directo.** | Solo por Pull Request desde `testing`. La organiza y aprueba el E1. |

---

## 2. Preparar la máquina la primera vez

Esto se hace **una sola vez por computadora**.

### 2.1. Clonar el repositorio

```bash
git clone https://github.com/gonzaleztomi1978-design/Sistema-Academico.git
cd Sistema-Academico
```

El repositorio es https://github.com/gonzaleztomi1978-design/Sistema-Academico. Si al clonar o al pushear te pide usuario y contraseña, la contraseña de GitHub no sirve: va un token personal (está explicado en [configuracion-github.md, sección 9](configuracion-github.md#9-problemas-frecuentes)). Si te rechaza por permisos, pedile al E1 que te invite como colaborador.

Al clonar quedás parado en `production`, que es la rama por defecto del repositorio. No trabajes ahí.

### 2.2. Configurar tu nombre y tu mail

Poné tu nombre real y el mail de tu cuenta de GitHub. Esto es lo que va a aparecer en cada commit que hagas.

```bash
git config user.name "Nombre Apellido"
git config user.email "tumail@ejemplo.com"
```

Verificá que haya quedado bien:

```bash
git config user.name
git config user.email
```

> Si querés que valga para todos tus repositorios y no solo para este, agregá `--global` en los dos comandos.

Configurá también VS Code como editor de Git. Si no lo hacés, Git para Windows abre **Vim** cada vez que necesita un mensaje (por ejemplo al cerrar un merge), y es muy fácil quedar trabado ahí adentro:

```bash
git config --global core.editor "code --wait"
```

Con eso, cuando Git pida un mensaje se abre una pestaña de VS Code: la guardás, la cerrás, y Git sigue solo.

### 2.3. Traer todas las ramas remotas

```bash
git fetch --all
git branch -a
```

`git branch -a` te tiene que listar, además de las locales, las remotas: `remotes/origin/e1`, `remotes/origin/e2`, `remotes/origin/e3`, `remotes/origin/e4`, `remotes/origin/development`, `remotes/origin/testing` y `remotes/origin/production`.

### 2.4. Pararte en la rama de tu equipo

```bash
git switch e2
```

Si te dice que esa rama no existe localmente, creála siguiendo a la remota:

```bash
git checkout -b e2 origin/e2
```

Confirmá dónde estás parado:

```bash
git branch --show-current
```

Tiene que decir `e2`. Si dice otra cosa, volvé a `git switch e2` antes de tocar un solo archivo.

### 2.5. Dejar el proyecto andando

Necesitás tener instalados .NET SDK 9, Node.js 20.19 o superior (Vite 8 no arranca con versiones anteriores) y SQL Server (Express alcanza). Parado en la **raíz del repositorio**:

```bash
cd backend
dotnet run --project SistemaAcademico.Api
```

La primera vez crea sola la base `SistemaAcademico` con los datos iniciales. Dejá esa terminal corriendo y abrí **otra**, también parada en la raíz del repositorio:

```bash
cd frontend
npm install
npm run dev
```

La API queda en http://localhost:5000 (Swagger en http://localhost:5000/swagger) y el frontend en http://localhost:5173.

> Si tu SQL Server no es `localhost\SQLEXPRESS`, tenés que ajustar la connection string de `backend/SistemaAcademico.Api/appsettings.json` en tu máquina. Ese archivo **está versionado**: el cambio lo dejás local y no lo subís nunca (mirá el Paso 4 del ciclo diario).

---

## 3. El ciclo de trabajo diario

Estos cinco pasos son el día entero. Hacelos en orden, todas las veces.

### Paso 1 — Pararte en tu rama y traer lo último que subieron tus compañeros

```bash
git switch e2
git pull origin e2
```

### Paso 2 — Traer lo último de development ANTES de empezar algo nuevo

Este es el paso que todos se olvidan y el que después genera los conflictos feos. Hacelo **antes** de escribir código nuevo, no después.

```bash
git fetch origin
git merge origin/development
```

- Si dice `Already up to date.`, no había nada nuevo. Seguí tranquilo.
- Si te abre un editor pidiendo el mensaje de merge, dejá el mensaje que propone, guardá y cerrá. En VS Code (sección 2.2): guardás con `Ctrl+S` y cerrás la pestaña. Si te quedó abierto Vim en la terminal: tocá `Esc`, escribí `:wq` y `Enter`.
- Si aparecen conflictos, andá a la sección 6 y resolvelos ahora, con la cabeza fresca, antes de arrancar la tarea nueva.

Después del merge, subí tu rama ya actualizada:

```bash
git push origin e2
```

### Paso 3 — Trabajar

Escribí tu código donde corresponde: entidades en `backend/SistemaAcademico.Domain/Entidades`, lógica en `backend/SistemaAcademico.Application/Servicios`, endpoints en `backend/SistemaAcademico.Api/Controllers`, pantallas en `frontend/src/paginas`.

Cada tanto, mirá cómo venís:

```bash
git status
git diff
```

### Paso 4 — Commitear con la convención

```bash
git status
git add .
git commit -m "E2: agrega inscripción de estudiantes a primer año"
```

Mirá el `git status` **antes** del `git add .`. Si le tocaste la connection string a `backend/SistemaAcademico.Api/appsettings.json` para conectarte a tu SQL Server, ese archivo no se sube: agregá los tuyos uno por uno en vez de `git add .`.

```bash
git add backend/SistemaAcademico.Application/Servicios/DocenteService.cs frontend/src/paginas/Docentes.jsx
```

Si ya lo agregaste sin querer, sacalo del stage antes de commitear:

```bash
git restore --staged backend/SistemaAcademico.Api/appsettings.json
```

El prefijo es el de **tu** equipo (`E1:`, `E2:`, `E3:` o `E4:`) y la descripción va corta y en presente.

| Bien | Mal |
|---|---|
| `E2: agrega endpoint de alta de docentes` | `cambios` |
| `E3: corrige validación de correlativas` | `E3: arreglé un par de cosas que estaban mal del otro día` |
| `E4: lista materias disponibles por estudiante` | `wip` |

Commiteá seguido y chico: un commit por cosa terminada, no uno gigante al final del día.

### Paso 5 — Verificar que compila y subir tu rama

Primero verificá que compile todo. Parado en la **raíz del repositorio**:

```bash
cd backend
dotnet build
```

Y desde `backend/`, pasate al frontend con `..` (si hacés `cd frontend` estando en `backend/` te va a decir que la carpeta no existe):

```bash
cd ../frontend
npm run build
```

Los dos tienen que terminar sin errores. Si alguno falla, arreglalo ahora: no sirve de nada subir algo que no compila.

Recién ahí subí tu rama. El `git push` funciona desde cualquier carpeta del repositorio:

```bash
git push origin e2
```

### El ciclo completo, de corrido

```bash
git switch e2
git pull origin e2
git fetch origin
git merge origin/development
# ... acá trabajás ...
git status
git add .
git commit -m "E2: agrega inscripción de estudiantes a primer año"
# ... y antes de pushear: dotnet build en backend/ y npm run build en frontend/ ...
git push origin e2
```

---

## 4. Abrir el Pull Request hacia development

Cuando la funcionalidad está terminada, compila y la probaste a mano, se abre el PR. **Nunca** se pushea directo a `development`.

1. Asegurate de haber hecho `git push origin e2`: lo que no está subido, no entra al PR.
2. Entrá al repositorio en GitHub. Te va a aparecer el cartel *Compare & pull request*; si no aparece, andá a la pestaña **Pull requests** y después a **New pull request**.
3. Elegí bien las dos ramas:
   - **base:** `development`
   - **compare:** `e2`
4. Revisá abajo la lista de archivos modificados. Si ves archivos que vos no tocaste (o que son de otro equipo), frená y avisale al E1 antes de seguir.
5. Completá el template que aparece solo en la descripción (`.github/PULL_REQUEST_TEMPLATE.md`). Tiene estas secciones:
   - **¿Qué hace este PR?** — dos o tres renglones en criollo: qué funcionalidad agrega, qué endpoint o pantalla nueva hay.
   - **Equipo** — tildá la casilla de tu equipo (E1, E2, E3 o E4).
   - **Rama origen y destino** — completá que va de `e2` (compare) a `development` (base).
   - **Issues o tareas relacionadas** — el issue que cierra o, si no hay, a qué tarea del equipo corresponde.
   - **Checklist** — tildá lo que realmente hiciste: que compila (`dotnet build` y `npm run build`), que lo probaste manualmente, que no subiste configuración personal, que mergeaste `development` en tu rama, y que si agregaste entidades o migraciones lo acordaste antes con la Mesa Técnica.
   - **Capturas / evidencia** — si es una pantalla, pegá una captura; si es un endpoint, la respuesta de Swagger.

   No tildes lo que no hiciste: el E1 lo va a verificar igual y perdés el viaje.
6. Título del PR: mismo estilo que los commits, por ejemplo `E2: inscripción a primer año`.
7. **Create pull request**.

### Los checks automáticos del PR

Apenas abrís el PR (y también en cada push a tu rama), GitHub corre solo el workflow `.github/workflows/ci.yml`. No son tests: lo único que hace es **compilar**, lo mismo que ya corriste vos en el Paso 5.

| Check | Qué hace | ¿Bloquea? |
|---|---|---|
| Compilar backend (.NET 9) | `dotnet restore` y `dotnet build` de `backend/SistemaAcademico.sln` | Sí |
| Compilar frontend (React + Vite) | `npm ci` y `npm run build` en `frontend/` | Sí |
| Lint (`npm run lint`, oxlint) | Avisa problemas de estilo del frontend | No, pero miralo y arreglalo |

Si un check sale en rojo, el PR no se mergea: abrí la pestaña **Checks** o **Details**, leé en qué paso falló, corregí en tu rama y volvé a pushear. El PR se actualiza solo.

> Si todavía no te aparece ningún check, puede ser que el workflow no haya llegado a la rama de destino. Avisale al E1 y seguí igual con `dotnet build` y `npm run build` a mano.

### Qué hace el E1 con ese PR

- Lo revisa: mira que el código respete las convenciones (código en español, endpoints `api/<recurso>` en plural y minúscula, errores como `{ "mensaje": "..." }`, bajas lógicas con `Activo`).
- Mira que los checks de compilación estén en verde y que el PR no venga con archivos de más (`bin/`, `obj/`, `node_modules/`, o `appsettings.json` con tu connection string).
- Si hay conflictos, **te lo devuelve para que los resuelvas en tu rama** (sección 6). No los arregla por su cuenta desde la interfaz de GitHub.
- Si está todo bien, mergea el PR a `development`.
- Más adelante, cuando `development` está sana, el E1 abre el PR `development` → `testing`, se prueba el sistema completo, y después el PR `testing` → `production`. Esos dos PR los arma y aprueba el E1: vos no los tocás.

Después de que te mergearon el PR, volvé al Paso 2 para bajar a tu rama lo que quedó integrado.

---

## 5. Antes de pedir la revisión, chequeá

- [ ] Estoy parado en la rama de mi equipo (`git branch --show-current`).
- [ ] Hice `git merge origin/development` y no quedaron conflictos.
- [ ] `dotnet build` (parado en `backend/`) pasa sin errores.
- [ ] `npm run build` (parado en `frontend/`) pasa sin errores.
- [ ] Los checks del último push a mi rama están en verde en GitHub.
- [ ] Probé la funcionalidad a mano, con el backend y el frontend levantados.
- [ ] Mis commits tienen el prefijo del equipo.
- [ ] No subí claves, `.env` ni mi connection string de `backend/SistemaAcademico.Api/appsettings.json`.

---

## 6. Resolver conflictos

Un conflicto aparece cuando dos equipos tocaron el mismo archivo en las mismas líneas. Es normal y no rompe nada: hay que sentarse a decidir qué queda.

**Regla del proyecto: los conflictos se resuelven en la rama del equipo, en tu máquina. No se resuelven con el botón "Resolve conflicts" de GitHub.** El editor web no te deja compilar ni probar, y con las migraciones de EF Core directamente te deja el proyecto roto.

### 6.1. El procedimiento

```bash
# 1. Pararte en tu rama y tenerla al día
git switch e2
git pull origin e2

# 2. Traer development y mergearlo encima
git fetch origin
git merge origin/development
```

Si hay conflicto, Git te avisa con algo así:

```
Auto-merging frontend/src/App.jsx
CONFLICT (content): Merge conflict in frontend/src/App.jsx
Automatic merge failed; fix conflicts and then commit the result.
```

### 6.2. Ver qué archivos están en conflicto

```bash
git status
```

Los vas a ver listados bajo `Unmerged paths` como `both modified`:

```
Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   frontend/src/App.jsx
```

Si querés solo la lista pelada de los archivos en conflicto:

```bash
git diff --name-only --diff-filter=U
```

### 6.3. Cómo se ven los marcadores

Abrí el archivo en VS Code. Vas a encontrar bloques así:

```jsx
<<<<<<< HEAD
        <Route path="/docentes" element={<RutaProtegida><Docentes /></RutaProtegida>} />
=======
        <Route path="/materias" element={<RutaProtegida><Materias /></RutaProtegida>} />
>>>>>>> origin/development
```

- Entre `<<<<<<< HEAD` y `=======` está **lo tuyo**, lo que hay en `e2`.
- Entre `=======` y `>>>>>>> origin/development` está **lo que viene de development**, o sea lo de los otros equipos.

Editá el archivo hasta que quede como tiene que quedar y **borrá las tres líneas de marcadores**. Si te queda una sola `<<<<<<<` o `=======` suelta, el proyecto no compila.

### 6.4. Cerrar el merge

```bash
# 1. Marcar cada archivo como resuelto
git add frontend/src/App.jsx

# 2. Cuando no queda ninguno, cerrar el merge
git status          # no tiene que quedar nada en "Unmerged paths"
git commit          # se abre con un mensaje de merge ya escrito: guardá y cerrá
```

```bash
# 3. Verificar que sigue compilando (parado en la raíz del repositorio)
cd backend
dotnet build
```

```bash
# seguís parado en backend/, así que al frontend se va con ..
cd ../frontend
npm run build
```

```bash
# 4. Subir la rama ya resuelta (el push anda desde cualquier carpeta del repo)
git push origin e2
```

Con ese push, el Pull Request que tenías abierto se actualiza solo y deja de mostrar conflictos.

> ¿Te perdiste en el medio y querés volver a como estaba antes del merge? `git merge --abort` deja todo como estaba. No perdés tu trabajo commiteado.

---

## 7. Los tres conflictos típicos de este proyecto

### 7.1. frontend/src/App.jsx — dos equipos agregan rutas

Es el conflicto más frecuente: cada equipo suma sus rutas en el mismo bloque del mismo archivo.

**Se quedan LAS DOS rutas. Nunca borres la ruta del otro equipo.**

Conflicto:

```jsx
<<<<<<< HEAD
        <Route path="/docentes" element={<RutaProtegida><Docentes /></RutaProtegida>} />
=======
        <Route path="/materias" element={<RutaProtegida><Materias /></RutaProtegida>} />
>>>>>>> origin/development
```

Resuelto:

```jsx
        <Route path="/docentes" element={<RutaProtegida><Docentes /></RutaProtegida>} />
        <Route path="/materias" element={<RutaProtegida><Materias /></RutaProtegida>} />
```

Ojo con los `import` de arriba del archivo: ahí pasa exactamente lo mismo y también se quedan los dos.

```jsx
import Docentes from "./paginas/Docentes.jsx";
import Materias from "./paginas/Materias.jsx";
```

Después de resolver, corré `npm run build` y probá que las dos rutas abran.

### 7.2. AppDbContextModelSnapshot.cs y migraciones de EF Core — NO se resuelven a mano

`backend/SistemaAcademico.Infrastructure/Migrations/AppDbContextModelSnapshot.cs` es un archivo **generado** por EF Core: describe el estado completo del modelo. Si dos equipos crearon migraciones, los dos lo modificaron y el conflicto es imposible de resolver a ojo. Editarlo a mano deja la base desincronizada del código.

**El snapshot y las migraciones no se editan: se regeneran.** El procedimiento es borrar tu migración, traer `development`, y volver a crearla encima.

```bash
# 0. Parado en tu rama, con tu trabajo ya commiteado
git switch e2
git status          # tiene que estar limpio
```

> Los comandos `dotnet ef` no vienen con el SDK: son una herramienta aparte que se instala **una vez por computadora**. Si te dice que el comando no existe, corré `dotnet tool install --global dotnet-ef --version 9.0.*` (si ya la tenías de antes, `dotnet tool update --global dotnet-ef --version 9.0.*`) y comprobá con `dotnet ef --version`.

```bash
# 1. Borrar TU migración (la última que creaste vos)
cd backend
dotnet ef migrations remove --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api
```

> `migrations remove` borra **la última** migración. Si creaste dos, corré el comando dos veces. Si ya la aplicaste a tu base local, primero volvé atrás con
> `dotnet ef database update NombreDeLaMigracionAnterior --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api`.

```bash
# 2. Commitear el borrado y recién ahí traer development
cd ..
git add .
git commit -m "E2: quita migracion propia para regenerarla sobre development"
git fetch origin
git merge origin/development
```

Ahora el merge de la carpeta `Migrations/` tiene que entrar limpio, porque tu migración ya no está y el snapshot que queda es el de `development`. Si igual aparece algún conflicto ahí adentro, quedate con la versión de `development`:

```bash
git checkout --theirs backend/SistemaAcademico.Infrastructure/Migrations/
git add backend/SistemaAcademico.Infrastructure/Migrations/
git commit
```

```bash
# 3. Volver a crear TU migración, ahora encima del modelo integrado
cd backend
dotnet ef migrations add AgregaDocentes --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api
```

```bash
# 4. Aplicarla a tu base local y verificar que levanta
dotnet ef database update --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api
dotnet build
dotnet run --project SistemaAcademico.Api
```

```bash
# 5. Subir la migración regenerada
cd ..
git add .
git commit -m "E2: regenera migracion de docentes sobre development"
git push origin e2
```

Acordate de que **las entidades y las migraciones se acuerdan antes con la Mesa Técnica** (`docs/mesa-tecnica.md`). Si dos equipos crean la misma tabla por su cuenta, esto se repite todas las semanas.

### 7.3. frontend/package-lock.json — se acepta el de development

Ese archivo lo genera npm solo y tiene miles de líneas. **Nunca se edita a mano.** Se acepta el de `development` y se reinstalan las dependencias.

```bash
# Quedarse con la versión de development
git checkout --theirs frontend/package-lock.json
git add frontend/package-lock.json
```

```bash
# Reinstalar y regenerar
cd frontend
npm install
```

```bash
# Si npm install modificó el lock (porque vos habías agregado un paquete), ese cambio sí va
cd ..
git add frontend/package-lock.json
git commit
```

Cerrá con `npm run build` para confirmar que el frontend sigue compilando.

> Si vos habías agregado un paquete nuevo, fijate que después del `npm install` siga figurando en `frontend/package.json`. Si el merge se lo llevó puesto, volvé a agregarlo con `npm install <paquete>` y commiteá los dos archivos juntos.

---

## 8. Reglas de oro

1. **Nunca** pushees directo a `development`, `testing` ni `production`. Todo entra por Pull Request.
2. **Nunca** uses `git push --force`. Si el push te rebota, se arregla con `git pull`, no a la fuerza (ver sección 9).
3. **Nunca** commitees `node_modules/`, `bin/`, `obj/` ni `frontend/dist/`. Ya están en `.gitignore`: si te aparecen en el `git status`, algo hiciste mal.
4. **Nunca** subas tu connection string, claves ni `.env`. La conexión sale de `backend/SistemaAcademico.Api/appsettings.json`, que **sí está versionado**: si lo tocás para apuntar a tu SQL Server, ese cambio queda en tu máquina y no entra en ningún commit. Si necesitás algo distinto, avisale al E1. (`appsettings.Local.json` figura en el `.gitignore`, pero hoy la API no lo lee: solo carga `appsettings.json` y `appsettings.Development.json`, así que no te sirve para cambiar la conexión.)
5. **Nunca** toques archivos de otro equipo sin avisar. Los compartidos (`App.jsx`, `Program.cs`, `AppDbContext.cs`) se tocan solo para agregar lo tuyo, nunca para modificar lo ajeno.
6. **Siempre** `git merge origin/development` antes de arrancar algo nuevo.
7. **Siempre** `dotnet build` y `npm run build` antes de abrir un PR.
8. Si algo no te cierra, preguntá antes de ejecutar. Un comando mal tirado a las apuradas le cuesta la tarde a los cuatro equipos.

---

## 9. Si te pasa esto, hacé esto

### Te rechaza el push por non-fast-forward

```
! [rejected]        e2 -> e2 (non-fast-forward)
error: failed to push some refs to '...'
hint: Updates were rejected because the tip of your current branch is behind
```

Significa que un compañero subió algo a `e2` después de tu último `pull`. No es un error tuyo y **no se arregla con `--force`**.

```bash
git pull origin e2      # trae lo de tu compañero y lo mergea con lo tuyo
# si aparecen conflictos, resolvelos como dice la sección 6
git push origin e2
```

### Commiteaste en la rama equivocada

Te diste cuenta de que hiciste el commit parado en `development`, en `production` o en la rama de otro equipo.

```bash
# 1. Parado todavía en la rama equivocada, anotá el hash del commit que te mandaste
git log --oneline -3

# 2. Pasate a tu rama y traelo (pegá el hash que anotaste, son los 7 caracteres del principio)
git switch e2
git cherry-pick HASH-DEL-COMMIT
git push origin e2

# 3. Volvé a la rama equivocada y dejala igual que en GitHub
#    (si te habías equivocado en otra, cambiá development por esa en las tres líneas)
git switch development
git fetch origin
git reset --hard origin/development
```

> Ese `reset --hard` sobre `development` es seguro **solo** si no llegaste a pushear (y a esas ramas no tenés que poder pushear). Si ya pusheaste a una rama protegida, no sigas solo: avisale al E1.

### Querés descartar cambios locales

```bash
# Descartar los cambios de UN archivo (vuelve a como estaba en el último commit)
git restore frontend/src/paginas/Docentes.jsx

# Descartar TODOS los cambios sin commitear
git restore .

# Dejar tu rama exactamente igual a la remota (perdés lo que no hayas pusheado)
git fetch origin
git reset --hard origin/e2
```

> `restore` y `reset --hard` **no se pueden deshacer**. Si dudás, guardá lo que tenés con `git stash` y recuperalo después con `git stash pop`.

### Te olvidaste de mergear development y ya trabajaste un montón

No pasa nada, se hace ahora. Commiteá primero lo que tengas suelto y después mergeá.

```bash
git switch e2
git add .
git commit -m "E2: guarda avance de docentes"
git fetch origin
git merge origin/development
# resolvé los conflictos que aparezcan (secciones 6 y 7)
git push origin e2
```

### No sabés en qué rama estás ni qué tenés sin subir

```bash
git branch --show-current
git status
git log --oneline --graph --all -15
```

### El PR muestra archivos que vos no tocaste

Casi siempre es porque commiteaste `bin/`, `obj/` o `node_modules/`, o porque mergeaste algo mal. Frená, no mergees nada y avisale al E1 con el link del PR.

---

## 10. Chuleta de comandos

| Qué querés hacer | Comando |
|---|---|
| Ver en qué rama estás | `git branch --show-current` |
| Ver todas las ramas (locales y remotas) | `git branch -a` |
| Traer info del remoto sin tocar tus archivos | `git fetch origin` |
| Traer todas las ramas remotas | `git fetch --all` |
| Pasarte a tu rama | `git switch e2` |
| Crear tu rama local siguiendo a la remota | `git checkout -b e2 origin/e2` |
| Bajar lo último de tu rama | `git pull origin e2` |
| Traer lo integrado en development | `git merge origin/development` |
| Ver qué cambiaste | `git status` / `git diff` |
| Preparar todo para commitear | `git add .` |
| Commitear con la convención | `git commit -m "E2: descripción corta en presente"` |
| Subir tu rama | `git push origin e2` |
| Ver los archivos en conflicto | `git diff --name-only --diff-filter=U` |
| Marcar un conflicto como resuelto | `git add <archivo>` |
| Cerrar el merge | `git commit` |
| Cancelar un merge a medias | `git merge --abort` |
| Quedarte con la versión de development de un archivo | `git checkout --theirs <archivo>` |
| Ver el historial resumido | `git log --oneline --graph --all -15` |
| Traer un commit de otra rama | `git cherry-pick <hash>` |
| Descartar cambios de un archivo | `git restore <archivo>` |
| Guardar cambios a un costado | `git stash` / `git stash pop` |
| Compilar el backend | `cd backend` y `dotnet build` |
| Compilar el frontend | `cd frontend` y `npm run build` |
| Crear una migración | `dotnet ef migrations add NombreMigracion --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api` |
| Borrar la última migración | `dotnet ef migrations remove --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api` |
| Aplicar migraciones a tu base | `dotnet ef database update --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api` |

---

Dudas de Git, ramas, PR o conflictos: preguntale al **E1**, que es el equipo de Acceso e Integración y el que mergea hacia `development`, `testing` y `production`.
