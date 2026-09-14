# Configuración del repositorio en GitHub

Guía para dejar el repositorio publicado en GitHub con la estructura de ramas que definió la Mesa Técnica. **La escribe y la ejecuta el E1** (Acceso e Integración), que es quien administra el repositorio.

Hacela una sola vez, de principio a fin y en orden. Si ya está hecha, saltá directo a la sección [8. Verificar que quedó bien](#8-verificar-que-quedó-bien).

> **Estado actual.** El repositorio ya existe en https://github.com/gonzaleztomi1978-design/Sistema-Academico. La configuración inicial ya se commiteó en las 7 ramas, se agregó el remoto y se publicaron las ramas (pasos "Antes de empezar", 1, 2 y 3). **Falta hacer desde la web de GitHub:** 4 (rama por defecto), 5 (invitar integrantes) y 6 (protecciones). Los pasos ya hechos quedan escritos como referencia, por si hay que rehacer el repositorio.

## Qué queremos dejar armado

```text
e1 ─┐
e2 ─┤
e3 ─┼─ PR ─> development ─ PR ─> testing ─ PR ─> production
e4 ─┘
```

| Rama | Para qué | ¿Quién pushea directo? |
|---|---|---|
| `production` | Versión estable y presentable. Rama por defecto del repo. | Nadie. Solo PR desde `testing`. |
| `testing` | Versión candidata: se prueba completa antes de darla por buena. | Nadie. Solo PR desde `development`. |
| `development` | Integración diaria del trabajo de los 4 equipos. | Nadie. Solo PR desde `e1`, `e2`, `e3` o `e4`. |
| `e1` | Trabajo del E1 — Acceso e Integración. | Integrantes del E1. |
| `e2` | Trabajo del E2 — Secretaría. | Integrantes del E2. |
| `e3` | Trabajo del E3 — Gestión Académica. | Integrantes del E3. |
| `e4` | Trabajo del E4 — Inscripciones. | Integrantes del E4. |

## Antes de empezar

- Tener una cuenta de GitHub (la tuya, la del E1 que administra).
- Tener Git instalado y configurado con tu nombre y tu mail:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@mail.com"
```

- Pararse en la carpeta del proyecto, la que tiene adentro `backend/`, `frontend/` y `README.md`. En Git Bash las rutas de Windows se escriben con barra normal y la unidad en minúscula (`C:\Users\...` pasa a ser `/c/Users/...`). Para confirmar que estás en el lugar correcto:

```bash
git rev-parse --show-toplevel
```

- Verificar el punto de partida. El repositorio local **todavía no tiene remoto**, así que `git remote -v` no tiene que devolver nada:

```bash
git status
git branch
git remote -v
```

Tenés que ver las 7 ramas (`production`, `testing`, `development`, `e1`, `e2`, `e3`, `e4`), las 7 apuntando al mismo commit, y `git remote -v` sin una sola línea.

### Dejar la configuración commiteada en las 7 ramas

Si `git status` muestra cambios sin commitear (los archivos de `.github/`, los de `docs/`, el `README.md`), **no los subas solo desde una rama**. El workflow de CI (`.github/workflows/ci.yml`) y las plantillas de PR los lee GitHub **desde la rama involucrada en el PR**: si la configuración queda únicamente en `production`, el CI no corre en los PR hacia `development` y la protección de la sección 6 nunca se puede cumplir.

Antes de commitear, fijate que `.github/CODEOWNERS` tenga el usuario real de GitHub de quien integra. Hoy dice `@gonzaleztomi1978-design`. Está explicado en la [sección 6](#revisión-automática-del-e1-codeowners); si hay que cambiarlo después de publicar, el cambio entra por PR como cualquier otro.

Como todavía no hay remoto y las 7 ramas están en el mismo commit, se arregla de una vez: commiteás y movés las otras 6 al commit nuevo.

```bash
git checkout production     # el commit tiene que quedar acá, las otras 6 lo siguen
git status                  # mirá qué va a entrar antes de agregar nada
git add .
git commit -m "E1: agrega configuracion de GitHub, CI y plantillas de PR"
git branch -f development production
git branch -f testing production
git branch -f e1 production
git branch -f e2 production
git branch -f e3 production
git branch -f e4 production
git branch -v               # las 7 tienen que mostrar el mismo commit nuevo
```

> **Esto vale únicamente ahora**, antes del primer push y con las 7 ramas en el mismo commit. `git branch -f` mueve una rama a la fuerza: una vez que el repositorio está publicado y los equipos clonaron, **no se usa más**, porque les reescribe la historia abajo de los pies. De ahí en adelante, todo entra por PR.

## 1. Crear el repositorio en GitHub (vacío)

Entrá a [github.com](https://github.com) > botón **New** (o el **+** de arriba a la derecha > **New repository**) y completá así:

| Campo | Qué poner |
|---|---|
| Owner | `gonzaleztomi1978-design` (o la organización de la cátedra, si corresponde). |
| Repository name | `Sistema-Academico` |
| Description | `Sistema Académico — Instituto Superior Cura Gabriel Brochero` |
| Public / Private | Ver la nota de abajo. |
| Add a README file | **Desmarcado** |
| Add .gitignore | **None** |
| Choose a license | **None** |

Después, **Create repository**.

> **Por qué vacío.** Si tildás README, `.gitignore` o licencia, GitHub crea un commit propio en el repositorio remoto. Ese commit no tiene nada que ver con nuestro commit local, y al hacer el primer push Git lo rechaza con `Updates were rejected` porque son dos historias sin ancestro común. Creándolo vacío, el primer push entra limpio.

> **Público o privado.** Las reglas de protección de rama (sección 6) están disponibles gratis en repositorios **públicos**. En repositorios **privados** de cuenta Free pueden no estar. Como en este proyecto no subimos connection strings, claves ni `.env`, conviene **Public** para tener las protecciones sin plan pago.

Al crearlo, GitHub te muestra una pantalla con instrucciones de "quick setup". Ignorala: seguí con esta guía, que contempla que ya tenemos commit y ramas hechas localmente.

## 2. Agregar el remoto al repositorio local

Con la URL del repositorio del proyecto:

```bash
git remote add origin https://github.com/gonzaleztomi1978-design/Sistema-Academico.git
```

Verificá que haya quedado:

```bash
git remote -v
```

Tiene que devolver dos líneas, `fetch` y `push`, apuntando a la misma URL:

```text
origin  https://github.com/gonzaleztomi1978-design/Sistema-Academico.git (fetch)
origin  https://github.com/gonzaleztomi1978-design/Sistema-Academico.git (push)
```

Si te equivocaste en la URL, no hace falta borrar nada:

```bash
git remote set-url origin https://github.com/gonzaleztomi1978-design/Sistema-Academico.git
```

## 3. Publicar todas las ramas y dejarles upstream

`git push -u origin <rama>` hace dos cosas: sube la rama y le deja configurado el **upstream** (la rama remota con la que se empareja). Con el upstream puesto, después alcanza con `git push` y `git pull` a secas, sin escribir el nombre de la rama.

**Empezá por `production`.** GitHub toma como rama por defecto la **primera** que recibe, así que si va primera te ahorrás trabajo (igual lo verificamos en la sección 4).

Ejecutá los comandos uno por uno, en este orden:

```bash
git push -u origin production
git push -u origin testing
git push -u origin development
git push -u origin e1
git push -u origin e2
git push -u origin e3
git push -u origin e4
```

La primera vez te va a pedir autenticarte: mirá la sección [9. Problemas frecuentes](#9-problemas-frecuentes), porque **la contraseña de GitHub ya no sirve**, va un token.

### Variante corta

Las 7 de una sola vez:

```bash
git push -u origin --all
```

Sube todas las ramas locales y les deja el upstream a todas. Es más rápido, pero no controlás el orden en que entran, así que después **sí o sí** hacé la sección 4 y dejá `production` como rama por defecto a mano.

### Comprobar que quedaron con upstream

```bash
git branch -vv
```

Cada rama tiene que mostrar su remota entre corchetes:

```text
  development a1b2c3d [origin/development] E1: agrega configuracion de GitHub ...
  e1          a1b2c3d [origin/e1] E1: agrega configuracion de GitHub ...
* production  a1b2c3d [origin/production] E1: agrega configuracion de GitHub ...
```

Si a alguna le falta el `[origin/...]`, volvé a pushearla con `-u`.

## 4. Poner `production` como rama por defecto

En GitHub, dentro del repositorio:

**Settings > General > Default branch > Switch to another branch** (el ícono de las dos flechitas) **> production > Update > I understand, update the default branch.**

> **Por qué importa.** La rama por defecto es contra la que GitHub abre los Pull Request por descuido: cuando alguien del E3 pushea `e3` y hace clic en *Compare & pull request*, el campo **base** viene precargado con la rama por defecto. Si la default fuera `development`, cualquier distraído mete código sin pasar por `testing`; con `production` como default, un PR mal apuntado queda frenado por las protecciones de la sección 6 en vez de entrar solo. Además, la rama por defecto es la que ve cualquiera que abre el repositorio: queremos que vea la versión estable y presentable, no la de integración.

Ojo: por eso mismo, en los PR hacia `development` hay que **cambiar la base a mano**. En la pantalla del PR, el desplegable de la izquierda (`base:`) se pone en `development` y el de la derecha (`compare:`) en la rama del equipo.

## 5. Invitar a los integrantes

**Settings > Collaborators** (en organizaciones aparece como **Collaborators and teams**) **> Add people >** escribís el usuario de GitHub o el mail de la persona **> Select a role > Write > Add**.

| Rol | Qué permite | ¿A quién? |
|---|---|---|
| Read | Solo mirar y clonar. | A nadie del proyecto. |
| Triage | Read + gestionar issues. | A nadie del proyecto. |
| **Write** | Pushear a ramas no protegidas, abrir y aprobar PR. | **A todos los integrantes de E1, E2, E3 y E4.** |
| Maintain | Write + tocar parte de la configuración. | Opcional, para el resto del E1. |
| Admin | Todo, incluido Settings y borrar el repositorio. | Solo quien administra el repo (E1) y el docente. |

Puntos a tener en cuenta:

- **Write alcanza y sobra** para los equipos: pueden pushear a `e1`..`e4` y abrir PR, pero no pueden saltearse las protecciones ni tocar Settings.
- La invitación **hay que aceptarla**: a cada persona le llega un mail y un aviso en GitHub. Hasta que no la acepta, sus push se rechazan por permisos.
- Repetí el alta para cada integrante, uno por uno. Anotá en el grupo quién quedó invitado para no olvidarse a nadie.

## 6. Reglas de protección de rama

**Settings > Rules > Rulesets > New ruleset > New branch ruleset.** (En la interfaz clásica el equivalente está en **Settings > Branches > Add branch protection rule**; los nombres de las opciones son casi los mismos.) Se crea **un ruleset por rama protegida**: uno para `production`, uno para `testing` y uno para `development`.

### Configuración exacta recomendada

| Opción | `production` | `testing` | `development` | `e1`..`e4` |
|---|---|---|---|---|
| Requiere Pull Request para mergear | Sí | Sí | Sí | No |
| Aprobaciones requeridas | 1 | 1 | 1 (la del E1) | — |
| Prohibir push directo | Sí | Sí | Sí | No |
| Prohibir force push | Sí | Sí | Sí | No |
| Prohibir borrado de la rama | Sí | Sí | Sí | No |
| Requiere que pase el check de CI | Sí | Sí | Sí | No |
| Origen permitido del merge | Solo `testing` (acuerdo del equipo) | Solo `development` (acuerdo del equipo) | Solo `e1`..`e4` (acuerdo del equipo) | — |
| ¿Quién mergea? | E1 | E1 | E1 | — |

Hay dos excepciones de emergencia al origen del merge, y las dos las maneja solo el E1: un `hotfix/...` puede entrar directo a `production` cuando algo se rompe en plena presentación, y una rama `revert/...` o `promocion/reintegra-...` puede entrar a `testing` para deshacer un merge roto. El procedimiento completo está en [`integracion-y-releases.md`](integracion-y-releases.md), secciones 8 y 9. Fuera de esos dos casos, el origen es siempre el de la tabla.

**`e1`, `e2`, `e3` y `e4` no llevan ninguna regla.** Son las ramas de trabajo: cada equipo pushea ahí directo, commitea cuando quiere y se equivoca tranquilo. Protegerlas solo lograría que los equipos no puedan trabajar.

### Cómo se traduce eso en la pantalla de GitHub

Para cada uno de los tres rulesets:

| Campo de la pantalla | Qué poner |
|---|---|
| Ruleset Name | `proteccion-production` (o `proteccion-testing` / `proteccion-development`) |
| Enforcement status | **Active** |
| Bypass list | Vacía (nadie se saltea la regla, el E1 tampoco) |
| Target branches > Add target > Include by pattern | El nombre exacto de la rama: `production` |

Y en **Branch rules**, tildá:

- **Restrict deletions** — que nadie borre la rama.
- **Block force pushes** — que nadie reescriba la historia.
- **Require a pull request before merging** — nada entra sin PR. Adentro de esa opción: **Required approvals: 1**.
- **Require status checks to pass** — que el PR no se pueda mergear si el build falla. Adentro, agregá los dos checks del workflow de CI.

> **Sobre el check de CI.** El workflow ya está en el repositorio, en `.github/workflows/ci.yml`, y define **dos** jobs. En el buscador de status checks los vas a encontrar por el nombre del job, tal cual:
>
> - `Compilar backend (.NET 9)` — corre `dotnet restore` y `dotnet build` sobre `backend/SistemaAcademico.sln`.
> - `Compilar frontend (React + Vite)` — corre `npm ci` y `npm run build` en `frontend/`.
>
> Agregá los dos. **Pero ojo:** GitHub solo lista los checks que ya vio correr al menos una vez en el repositorio, así que recién después del primer push o del primer PR te van a aparecer en el buscador. Si todavía no están, dejá la opción destildada, terminá el resto del ruleset y **volvé a esta pantalla** a marcarla cuando el CI haya corrido una vez. Mientras tanto, el control de que compila lo hace a mano quien revisa el PR: está en el checklist de `.github/PULL_REQUEST_TEMPLATE.md`.

> **No podés aprobar tu propio PR.** GitHub no te deja dar *Approve* en un PR que abriste vos. Como las promociones `development` → `testing` y `testing` → `production` las abre el E1, con **Required approvals: 1** y la *Bypass list* vacía el E1 **necesita que otra persona apruebe** para poder mergear. Resolvelo así: que las promociones las abra un integrante del E1 y las apruebe otro. Si el E1 es una sola persona, tenés dos opciones honestas: que apruebe el docente (tiene Admin), o bajar **Required approvals a 0** en `testing` y `production` dejando igual el *Require a pull request* (sigue habiendo PR y sigue sin haber push directo). Lo que **no** hay que hacer es meterse en la *Bypass list*, porque eso desactiva todas las reglas para vos.

> **Sobre "permitir merge solo desde `testing`".** GitHub **no** tiene una opción que limite desde qué rama se puede mergear hacia otra. Que `production` solo reciba `testing`, que `testing` solo reciba `development` y que `development` solo reciba `e1`..`e4` es un **acuerdo del equipo**, y se hace cumplir en la revisión: antes de aprobar, el E1 mira el encabezado del PR (`base: production` ← `compare: testing`) y, si el `compare` no es el que corresponde, lo cierra y pide que se rehaga. Es la regla que más se rompe por descuido, así que fijate siempre.

### Revisión automática del E1 (CODEOWNERS)

El repositorio ya trae `.github/CODEOWNERS`, que dice qué partes del proyecto tiene que revisar sí o sí el E1 (`Program.cs`, `appsettings*.json`, migraciones, entidades de autenticación, `frontend/src/api.js`, y demás). Para que sirva hay que hacer dos cosas, y **ninguna de las dos es automática**:

1. **Tener el usuario correcto.** `.github/CODEOWNERS` hoy asigna todo a `@gonzaleztomi1978-design`. Si hay más integrantes del E1 que tienen que revisar, agregá sus usuarios en la misma línea, separados por espacio (por ejemplo `* @gonzaleztomi1978-design @otro-usuario-del-e1`). Cada persona listada tiene que ser colaboradora del repositorio con rol **Write** como mínimo (sección 5); si no, GitHub la ignora.
2. **Activar la opción en el ruleset.** En cada uno de los tres rulesets, adentro de **Require a pull request before merging**, tildá **Require review from Code Owners**.

Un detalle que confunde: GitHub lee el `CODEOWNERS` **de la rama base del PR**. O sea que para que funcione en los PR hacia `development`, el archivo corregido tiene que estar en `development`, no solo en `production`. Si hiciste el reemplazo antes del primer push, como dice [Dejar la configuración commiteada en las 7 ramas](#dejar-la-configuración-commiteada-en-las-7-ramas), ya está en todas. Si te acordás después de publicar, el arreglo entra por el camino normal: lo commiteás en `e1` y lo llevás por PR `e1` → `development` → `testing` → `production`.

### Qué está disponible gratis y qué puede requerir plan pago

| Situación | Reglas de protección / rulesets |
|---|---|
| Repositorio **público** (cuenta Free) | Disponibles, completas y gratis. |
| Repositorio **privado** (cuenta Free) | Limitadas o no disponibles; varias opciones pueden pedir plan pago (Team / Pro). |
| Repositorio en una **organización** con plan pago o educativo | Disponibles. |

Si la opción te aparece deshabilitada o GitHub te pide mejorar el plan, tenés dos caminos:

1. **Pasar el repositorio a público** (Settings > General > Danger Zone > Change repository visibility). No subimos claves ni connection strings, así que no hay problema.
2. **Sostenerlo por acuerdo del equipo**, si tiene que seguir privado. En ese caso escribilo acá y avisalo en el grupo, y se cumple igual:
   - Nadie pushea a `development`, `testing` ni `production`, aunque Git se lo permita.
   - Todo entra por PR igual, con la misma revisión.
   - **Solo el E1 mergea.** Nadie más aprieta el botón *Merge pull request*.
   - El E1 revisa cada tanto `git log --oneline development` buscando commits que hayan entrado sin PR, y avisa en el grupo si aparece alguno.

## 7. Si el repositorio es de la cátedra o de una organización

Cuando el repositorio no es tuyo sino de la cátedra (una organización de GitHub, o un repositorio creado por GitHub Classroom), cambia **quién puede tocar Settings**:

- La pestaña **Settings** la ven únicamente quienes tienen rol **Admin** sobre el repositorio, o son *owners* de la organización. Con rol **Write** la pestaña ni siquiera aparece.
- Los pasos 4 (rama por defecto), 5 (colaboradores) y 6 (protecciones) **son todos de Settings**. Si el E1 no tiene Admin, no los puede hacer.
- En repositorios de GitHub Classroom el repositorio lo crea la cátedra, y el owner es la organización de la materia, no el estudiante.

Qué hacer en ese caso:

1. Pedile al docente a cargo que te dé rol **Admin** sobre el repositorio del proyecto (Settings > Collaborators > tu usuario > Role: Admin). Es lo más práctico: el E1 es el integrador y necesita administrar las ramas.
2. Si eso no se puede, pasale al docente esta guía con el pedido concreto y puntual:
   - Rama por defecto: `production`.
   - Colaboradores: los integrantes de los 4 equipos, con rol **Write**.
   - Protecciones en `production`, `testing` y `development`, según la tabla de la sección 6.
   - Sin protección en `e1`, `e2`, `e3` y `e4`.
3. Las secciones 2 y 3 (agregar el remoto y publicar las ramas) **sí** las podés hacer con rol Write: no necesitan Settings.

Dejá asentado en el grupo quién quedó como Admin, para que todos sepan a quién pedirle un cambio de configuración.

## 8. Verificar que quedó bien

| # | Qué hacés | Qué tenés que ver |
|---|---|---|
| 1 | `git remote -v` | Dos líneas (`fetch` y `push`) apuntando a `https://github.com/gonzaleztomi1978-design/Sistema-Academico.git`. |
| 2 | `git branch -a` | Las 7 ramas locales **y** las 7 `remotes/origin/...`: `origin/production`, `origin/testing`, `origin/development` y `origin/e1` a `origin/e4`. |
| 3 | `git branch -vv` | Cada rama local con su `[origin/<rama>]` entre corchetes. |
| 4 | Abrir el repositorio en GitHub | El desplegable de ramas muestra las 7, y arriba dice **production** con la etiqueta `default`. |
| 5 | Settings > Collaborators | Todos los integrantes listados con rol **Write** (los que todavía no aceptaron figuran como *Pending invite*). |
| 6 | Settings > Rules > Rulesets | Tres rulesets en **Active**: `production`, `testing` y `development`. Ninguno sobre `e1`..`e4`. |
| 7 | Probar un push directo a `development` | Que **lo rechace**. Ver abajo. |
| 8 | Desde otra máquina: `git clone https://github.com/gonzaleztomi1978-design/Sistema-Academico.git` | Clona y queda parado en `production`. |

### Prueba 7: que el push directo a `development` rebote

Esta es la comprobación que de verdad importa, porque es la que sostiene todo el flujo. Hacela vos, a propósito:

```bash
git checkout development
git commit --allow-empty -m "E1: prueba de proteccion de rama"
git push origin development
```

Tiene que **fallar**, con un mensaje parecido a este:

```text
remote: error: GH006: Protected branch update failed for refs/heads/development.
remote: error: Changes must be made through a pull request.
! [remote rejected] development -> development (protected branch hook declined)
```

**Si el push fue rechazado** (que es lo que esperamos), la protección anda. Borrá el commit de prueba, que quedó solo en tu copia local, y volvé a tu rama:

```bash
git reset --hard HEAD~1
git log --oneline -1
git checkout e1
```

El último commit tiene que volver a ser el que había antes de la prueba.

**Si el push entra**, la protección no quedó aplicada: volvé a la sección 6 y revisá que el ruleset esté en **Active**, que el *target branch* sea exactamente `development` y que la *Bypass list* esté vacía (si estás vos en la bypass list, la regla no se te aplica y por eso pasó). Además, ojo con el commit de prueba: ya subió, así que **no alcanza con `git reset --hard` local**, eso te deja atrasado respecto del remoto. Es un commit vacío y no rompe nada: dejalo donde está, no lo borres con `git push --force`, y seguí con `git pull origin development` para volver a quedar alineado. Cuando arregles el ruleset, repetí la prueba.

## 9. Problemas frecuentes

### `error: remote origin already exists.`

Ya habías agregado un remoto llamado `origin`, quizá con la URL mal escrita. No lo agregues de nuevo: corregí la URL, o borralo y volvelo a crear.

```bash
git remote -v                  # ver qué URL tiene hoy
git remote set-url origin https://github.com/gonzaleztomi1978-design/Sistema-Academico.git
```

Si preferís borrarlo y empezar de cero:

```bash
git remote remove origin
git remote add origin https://github.com/gonzaleztomi1978-design/Sistema-Academico.git
```

### `remote: Permission to gonzaleztomi1978-design/Sistema-Academico.git denied` (error 403)

Te falta permiso para pushear. Revisá, en este orden:

1. **¿Estás invitado?** El E1 tiene que haberte agregado en Settings > Collaborators con rol **Write**.
2. **¿Aceptaste la invitación?** Fijate en el mail o entrá a [github.com/notifications](https://github.com/notifications). Hasta que no la aceptás, no tenés permiso.
3. **¿Estás autenticado con la cuenta que corresponde?** Es muy común quedar logueado con una cuenta vieja guardada en la máquina. Mirá el punto del Administrador de credenciales, más abajo.
4. **¿Estabas pusheando a una rama protegida?** Si el mensaje dice `protected branch`, no es un problema de permisos: es la regla funcionando. Pusheá a tu rama de equipo y abrí un PR.

### `remote: Support for password authentication was removed`

GitHub **ya no acepta la contraseña de tu cuenta** para pushear por HTTPS. Hay que usar un **token de acceso personal (PAT)**:

1. En GitHub: foto de perfil > **Settings** (los de tu cuenta, no los del repositorio) > abajo de todo **Developer settings** > **Personal access tokens** > **Tokens (classic)** > **Generate new token (classic)**.
2. Completá:
   - **Note**: `sistema-academico`
   - **Expiration**: lo que dure la cursada (por ejemplo, 90 días).
   - **Scopes**: tildá **`repo`**. Con eso alcanza.
3. **Generate token** y **copialo en ese momento**: GitHub no te lo vuelve a mostrar nunca más.
4. Cuando Git te pida credenciales, poné tu usuario de GitHub en *Username* y **pegá el token en el campo de la contraseña**.

> El token es una clave: **no se sube al repositorio, no se pega en el grupo y no se comparte entre equipos.** Cada uno genera el suyo. Si se te filtró, borralo desde esa misma pantalla (*Delete*) y generá otro.

Si en vez del prompt se te abre una ventana del navegador para autorizar con tu cuenta, también sirve: es Git Credential Manager haciendo el login por vos.

### Windows guarda las credenciales y te sigue autenticando con la cuenta vieja

En Windows, Git guarda el usuario y el token en el **Administrador de credenciales** y los reusa sin volver a preguntarte. Si cambiaste de cuenta, si el token venció, o si te rechaza por permisos sin motivo aparente, borrá la credencial guardada:

1. Menú Inicio > escribí **Administrador de credenciales** > **Credenciales de Windows**.
2. Buscá la entrada **`git:https://github.com`**.
3. Desplegala > **Quitar**.

También se puede desde la consola:

```powershell
cmdkey /list | findstr github
cmdkey /delete:git:https://github.com
```

La próxima vez que hagas `git push`, Git te vuelve a pedir usuario y token, y ahí ponés los correctos.

### `! [rejected] production -> production (fetch first)`

El repositorio remoto tiene commits que tu copia local no tiene: casi siempre es porque al crearlo en GitHub quedó tildado el README o el `.gitignore`. Lo más limpio es borrar ese repositorio en GitHub (Settings > General > Danger Zone > Delete this repository) y volver a crearlo **vacío**, como dice la sección 1. **Nunca resuelvas esto con `git push --force`**: te lleva puesto lo que haya del otro lado.

### `error: src refspec <rama> does not match any`

El nombre de la rama está mal escrito, o esa rama no existe en tu copia local. Verificá con `git branch` y fijate que las ramas son exactamente `production`, `testing`, `development`, `e1`, `e2`, `e3` y `e4`, todas en minúscula. Las viejas `main`, `desarrollo`, `equipo1-acceso`, `equipo2-secretaria`, `equipo3-gestion-academica` y `equipo4-inscripciones` **ya no existen**: fueron renombradas.

## Checklist final del E1

- [ ] `.github/CODEOWNERS` con los usuarios reales del E1 (hoy `@gonzaleztomi1978-design`).
- [ ] Configuración (`.github/`, `docs/`, `README.md`) commiteada y presente en las 7 ramas.
- [ ] Repositorio creado en GitHub, vacío (sin README, sin `.gitignore`, sin licencia).
- [ ] `git remote add origin ...` hecho y verificado con `git remote -v`.
- [ ] Las 7 ramas publicadas con `-u`, empezando por `production`.
- [ ] `production` confirmada como rama por defecto.
- [ ] Todos los integrantes invitados con rol **Write**, y avisados de que tienen que aceptar la invitación.
- [ ] Rulesets activos en `production`, `testing` y `development`; `e1`..`e4` sin protección.
- [ ] Los dos checks del CI (`Compilar backend (.NET 9)` y `Compilar frontend (React + Vite)`) agregados como *status checks* requeridos, una vez que corrieron la primera vez.
- [ ] Push directo a `development` probado, **rechazado**, y commit de prueba deshecho.
- [ ] Link del repositorio compartido con los 4 equipos.
