# Integración y releases — runbook del E1

Este documento es para **la persona del E1 que hace de integrador**: la que junta lo que hacen los cuatro equipos, lo prueba y deja `production` presentable.

Si sos integrante de E2, E3 o E4, lo que te toca a vos está en [`docs/flujo-git.md`](flujo-git.md) (rama propia, commit, push, PR a `development`). Igual leelo: acá vas a entender por qué a veces te pedimos cambios en un PR en vez de mergearlo.

## Ramas del repositorio

```
e1 ─┐
e2 ─┤
e3 ─┼─ PR ─> development ─ PR ─> testing ─ PR ─> production
e4 ─┘
```

| Rama | Para qué es | ¿Quién pushea directo? |
|---|---|---|
| `e1` | Trabajo del E1 (login, usuarios, roles, permisos, integración). | Integrantes del E1. |
| `e2` | Trabajo del E2 (inscripción a 1.º, cursos-comisiones, docentes). | Integrantes del E2. |
| `e3` | Trabajo del E3 (planes de estudio, materias, correlatividades). | Integrantes del E3. |
| `e4` | Trabajo del E4 (inscripciones 2.º/3.º, consulta de materias, correlativas). | Integrantes del E4. |
| `development` | Integración diaria: acá se junta todo. | **Nadie.** Solo PR desde `e1`..`e4`. |
| `testing` | Versión candidata, se prueba completa antes de darla por buena. | **Nadie.** Solo PR desde `development`. |
| `production` | Versión estable y presentable. Es la rama por defecto del repo en GitHub. | **Nadie.** Solo PR desde `testing` (o de un `hotfix/`). |

Regla de oro: **a `development`, `testing` y `production` se entra únicamente por Pull Request**. Nunca `git push origin development` desde tu máquina, aunque tengas permiso técnico para hacerlo.

---

## 1. Rol del integrador

El integrador **no** es el que más código escribe: es el que garantiza que lo que está en `production` se pueda mostrar sin sorpresas.

### Qué decide

- Si un PR hacia `development` se mergea, se devuelve con cambios pedidos, o queda esperando.
- Cuándo se promueve `development` a `testing` (o sea, cuándo cortamos una versión candidata).
- Cuándo se promueve `testing` a `production` y qué número de versión lleva el tag.
- Cuándo algo amerita un `hotfix/` y cuándo puede esperar al próximo ciclo normal.
- Si hay que revertir un merge que dejó `testing` roto.

### Qué NO decide

- **Cómo resuelve cada equipo su módulo por dentro.** Si el E3 quiere separar un servicio en dos, es problema del E3.
- **Entidades y migraciones nuevas**: eso se acuerda en la Mesa Técnica (`docs/mesa-tecnica.md`), no lo define el integrador solo. Su rol ahí es verificar que el acuerdo exista antes de mergear.
- **Cambios de arquitectura o de convenciones**: también Mesa Técnica.
- **Arreglar el código de otro equipo por afuera.** Si un PR viene roto, se piden cambios en el PR. El integrador no "acomoda" el trabajo ajeno en silencio: si lo hace, el equipo autor nunca se entera de lo que hizo mal y vuelve a pasar.

### De qué es responsable

| Rama | Responsabilidad del integrador |
|---|---|
| `development` | Que siempre compile (`dotnet build` y `npm run build` verdes). Si alguien la rompe, o se arregla en el día o se revierte el merge. |
| `testing` | Que lo que está ahí haya sido probado a mano de punta a punta con la checklist de la sección 5. |
| `production` | Que sea mostrable en cualquier momento sin aviso previo, que esté etiquetada con `git tag` y que tenga notas de versión. |

Si tenés que elegir entre "mergear rápido para no frenar al equipo" y "que `production` quede sana", elegí siempre lo segundo. Frenar un PR cuesta una tarde; una demo rota cuesta la nota.

---

## 2. Recibir un PR de un equipo hacia `development`

Cuando llega un PR `eX` → `development`, revisalo con esta checklist antes de tocar el botón de merge.

### Checklist de revisión

- [ ] **La base del PR es `development`.** No `testing`, no `production`.
- [ ] **El CI está en verde.** Abajo del PR, GitHub muestra los checks del workflow `CI` (`.github/workflows/ci.yml`): los jobs *Compilar backend (.NET 9)* y *Compilar frontend (React + Vite)*. Si alguno está en rojo, **no se mergea**: entrá al check, leé el error y pedí el arreglo. Es el primer filtro y es gratis.
- [ ] **Compila el backend.** `dotnet build` en `backend/` sin errores (ver sección 3 para verificarlo local).
- [ ] **Compila el frontend.** `npm run build` en `frontend/` sin errores.
- [ ] **Respeta la estructura de carpetas.** Entidades en `SistemaAcademico.Domain/Entidades`, servicios y DTOs en `SistemaAcademico.Application`, controllers en `SistemaAcademico.Api/Controllers`, `AppDbContext` y migraciones en `SistemaAcademico.Infrastructure`, pantallas en `frontend/src/paginas`, componentes compartidos en `frontend/src/componentes`. Nada de carpetas nuevas inventadas al costado.
- [ ] **No trae configuración personal.** Fijate que no aparezca `appsettings.Local.json`, ni una connection string propia metida en `appsettings.json`, ni `.env`, ni claves ni tokens.
- [ ] **No trae basura versionada.** Nada de `node_modules/`, `bin/`, `obj/`, `frontend/dist/`, `.vs/`, `*.user`. Si aparecen, se ignoró mal el `.gitignore` o alguien forzó un `git add -f`.
- [ ] **Entidades y migraciones acordadas.** Si el diff toca `Domain/Entidades`, `AppDbContext.cs` o `Infrastructure/Migrations`, tiene que estar acordado en `docs/mesa-tecnica.md`. Si no está, **no se mergea**: primero se acuerda.
- [ ] **Una sola migración por funcionalidad y nada de migraciones duplicadas.** Dos equipos con migraciones que crean la misma tabla es el problema más caro de arreglar después.
- [ ] **Prefijo de commit correcto.** `E2: descripción corta en presente`. El prefijo tiene que coincidir con el equipo dueño de la rama.
- [ ] **No pisa archivos de otro equipo.** Si un PR del E4 toca la pantalla de docentes (que es del E2) o el servicio de usuarios (que es del E1), preguntá por qué antes de mergear. Excepción normal: archivos compartidos como `App.jsx` (rutas) o `AppDbContext.cs` (un `DbSet` nuevo), que sí se tocan de a poco y donde es esperable un conflicto chico.
- [ ] **El PR probó lo suyo a mano.** El template pide capturas o evidencia; si no hay nada y la funcionalidad es visible, pedila.
- [ ] **No hay conflictos con `development`.** Si GitHub marca conflicto, lo resuelve el equipo autor en su rama (ver sección 3, "Si hay conflictos"), no el integrador a mano desde la web.

### Qué hacer si no cumple

1. **Pedí cambios en el PR**, con un comentario concreto por cada punto: qué falla, en qué archivo, y qué esperás que quede. Nada de "no anda".
2. **No lo mergees igual pensando en arreglarlo después.** Un merge que rompe `development` frena a los cuatro equipos.
3. **No lo arregles por afuera** en tu propia rama ni con un commit tuyo encima. El equipo tiene que corregirlo en su rama y pushear: el PR se actualiza solo.
4. Si es algo de cinco minutos y el equipo no está disponible (por ejemplo, un `bin/` que se coló), igual **pedilo por el PR** y avisá por el canal del curso. Si ya estamos sobre una entrega y no hay tiempo, lo arreglás vos **en la rama del equipo** (`eX`), nunca en `development`, y lo escribís en el PR para que quede constancia.

Comentario tipo para pedir cambios:

```
No lo mergeo todavía, faltan dos cosas:

1. `npm run build` falla en frontend/src/paginas/Inscripciones.jsx:42
   (el import de `apiFetch` está mal escrito).

2. El PR trae backend/SistemaAcademico.Api/bin/. Sacalo con:
   git rm -r --cached backend/SistemaAcademico.Api/bin
   git commit -m "E4: saca bin del control de versiones"
   git push origin e4

Cuando lo pushees, este PR se actualiza solo y lo vuelvo a mirar.
```

---

## 3. Verificar un PR localmente antes de aprobarlo

La revisión en GitHub sirve para leer el diff. Para saber si **funciona**, hay que bajarlo y levantarlo.

> Todos los comandos de este documento se corren **parados en la raíz del repositorio** (la carpeta `Sistema-Academico` que te quedó al clonar), salvo donde se aclare que hay que entrar a `backend/` o a `frontend/`. Si no sabés dónde estás parado, corré `pwd`.

```bash
# 1. Traer al repositorio local todo lo que hay en GitHub
git fetch origin

# 2. Pararse en development y actualizarla
git checkout development
git pull origin development

# 3. Pasarse a la rama del equipo que abrió el PR
#    (si nunca la tuviste local, este checkout la crea siguiendo a origin/e2)
git checkout e2
git pull origin e2
```

Si querés ver exactamente cómo quedaría `development` con ese PR adentro, probá el merge en una rama descartable:

```bash
git checkout development
git checkout -b prueba/pr-e2        # rama temporal, no se sube nunca
git merge e2                        # si hay conflictos, mirá más abajo
```

### Compilar

```bash
# Backend (parado en la raíz del repositorio)
cd backend
dotnet build

# Frontend
cd ../frontend
npm install
npm run build
npm run lint

# Volver a la raíz
cd ..
```

`dotnet build` y `npm run build` tienen que terminar sin errores. El `npm install` va siempre: si el PR agregó una dependencia, sin eso no compila y vas a creer que está roto cuando no lo está.

`npm run lint` (oxlint) es aparte: **avisa pero no bloquea**, igual que en el CI. Si tira algo, pedile al equipo que lo mire, pero no frenes el PR por eso.

### Levantar y probar a mano

En dos terminales distintas:

```bash
# Terminal 1 — API en http://localhost:5000 (Swagger en /swagger)
# Parado en la raíz del repositorio:
cd backend
dotnet run --project SistemaAcademico.Api
```

```bash
# Terminal 2 — frontend en http://localhost:5173
# Parado en la raíz del repositorio:
cd frontend
npm run dev
```

Y ahí sí:

- Entrá a `http://localhost:5173` y logueate con `secretario` / `Secretario123` y después con `estudiante` / `Estudiante123`.
- Probá **la funcionalidad del PR**, no solamente que la pantalla abra.
- Probá que **lo que ya andaba siga andando**: login, listado de usuarios y las pantallas de los otros equipos que ya estaban.
- Si el PR agregó endpoints, mirálos en Swagger (`http://localhost:5000/swagger`): que la ruta sea `api/<recurso>` en plural y minúscula, y que los errores devuelvan `{ "mensaje": "..." }` con el HTTP que corresponde.
- Si el PR trae migraciones, probá con **base de cero** (ver sección 5).

### Si hay conflictos

Los resuelve el **equipo autor en su rama**, con vos al lado si hace falta. Lo que le pedís al equipo:

```bash
git checkout e2
git pull origin e2
git fetch origin                  # sin esto, origin/development es una foto vieja
git merge origin/development      # se traen development a su rama
# resolver los conflictos en el editor, y después, archivo por archivo:
git add frontend/src/App.jsx
git commit                        # deja el mensaje de merge que propone Git
git push origin e2
```

El detalle de cómo resolver cada tipo de conflicto (rutas en `App.jsx`, migraciones, `package-lock.json`) está en [`docs/flujo-git.md`](flujo-git.md), secciones 6 y 7.

El PR se actualiza solo y queda sin conflictos.

### Limpiar la rama temporal

```bash
git checkout development
git branch -D prueba/pr-e2
```

---

## 4. Estrategia de merge: siempre merge commit

En GitHub, al mergear un PR hacia `development`, `testing` o `production`, usá **"Create a merge commit"**. Ni *Squash and merge*, ni *Rebase and merge*.

Desde la consola, el equivalente es el comando de abajo, pero **solo sirve para probar en una rama temporal** como `prueba/pr-e2` (sección 3). Hacia `development`, `testing` y `production` el merge se hace siempre con el botón del PR en GitHub.

```bash
git merge --no-ff e2
```

### Por qué

- **No reescribe historia que otros ya tienen.** `e1`..`e4`, `development` y `testing` son ramas compartidas: los cuatro equipos las tienen clonadas. Con squash o rebase, los commits cambian de SHA y todos los que ya tenían esa rama quedan con un historial que no coincide. El síntoma típico es alguien que hace `git pull` y le aparecen treinta commits duplicados, o un conflicto imposible contra su propio código.
- **Queda claro qué entró y cuándo.** El merge commit es una marca: "acá entró el PR del E3". Si algo se rompe, mirás los merges recientes y ya sabés por dónde empezar.
- **Se puede deshacer de una.** Un merge commit se revierte entero con `git revert -m 1` (sección 9). Un squash pierde el detalle de adentro, y un rebase directamente no deja un punto único para revertir.
- **Sirve para la defensa del proyecto.** El historial muestra quién hizo qué y cómo se integró, que es justamente lo que se evalúa.

> Dentro de su propia rama, un equipo puede ordenar sus commits como quiera **mientras no los haya pusheado**. Una vez que están arriba en `eX`, tampoco se reescriben.

---

## 5. Promoción `development` → `testing`

### Cuándo se hace

Una vez por semana, día fijo (por ejemplo, miércoles), o cuando hay una entrega cerca. La idea es cortar una **versión candidata**: lo que hay en `development` congelado para probarlo completo.

### Cómo se prepara

Antes de abrir el PR, verificá:

- [ ] Están mergeados todos los PR de la semana que tenían que entrar. Los que quedaron a medias esperan al próximo corte.
- [ ] El último run del workflow `CI` sobre `development` terminó en verde (pestaña **Actions** del repositorio).
- [ ] `development` está **verde** también en tu máquina: `dotnet build` y `npm run build` pasan.
- [ ] Probaste `development` local con base de cero (ver más abajo).
- [ ] No hay migraciones pendientes de acordar en `docs/mesa-tecnica.md`.
- [ ] Avisaste a los cuatro equipos que se corta: si alguien tiene algo casi listo, que abra el PR ya o que espere al próximo.

```bash
# Parado en la raíz del repositorio
git checkout development
git pull origin development

cd backend
dotnet build

cd ../frontend
npm install
npm run build

cd ..
```

### Cómo se abre el PR

En GitHub: **New pull request**, `base: testing` ← `compare: development`.

Título sugerido: `Release candidata v1.1.0` (o con la fecha del corte).

En el cuerpo, listá qué entra y de qué equipo:

```
Entra en esta candidata:

- E2: inscripción a primer año + listado de estudiantes por curso
- E3: ABM de materias y carga de correlatividades
- E4: consulta de materias disponibles con validación de correlativas
- E1: permiso inscripciones.consultar asignado al rol Estudiante

Migraciones nuevas: AgregaMateriaYCorrelatividad, AgregaInscripcion
```

Mergealo con **merge commit**.

### Pruebas manuales obligatorias sobre `testing`

Después de mergear, bajá `testing` y pasá toda esta lista. Si algo falla, no se promueve a `production`.

```bash
git checkout testing
git pull origin testing
```

**Primero, base de datos de cero**, porque valida las migraciones de los cuatro equipos juntas.

Para borrar la base hace falta la herramienta `dotnet-ef`, que **no viene con el SDK**. Se instala una sola vez por máquina:

```bash
dotnet tool install --global dotnet-ef --version 9.0.*
```

Después, con la API **detenida** (si la dejás corriendo, mantiene la conexión abierta y el drop falla):

```bash
# Parado en la raíz del repositorio
cd backend
dotnet ef database drop --force --project SistemaAcademico.Infrastructure --startup-project SistemaAcademico.Api
dotnet run --project SistemaAcademico.Api
```

El `--force` evita que el comando te pregunte y se quede esperando una confirmación.

Al levantar de nuevo tiene que crear la base `SistemaAcademico` sola, aplicar todas las migraciones sin error y cargar los datos iniciales (roles, permisos y los dos usuarios de prueba). Si esto falla, hay un choque de migraciones entre equipos: frená ahí y avisale al equipo responsable.

Después, con el frontend levantado (`npm run dev`):

| # | Prueba | Resultado esperado |
|---|---|---|
| 1 | Login con `secretario` / `Secretario123` | Entra y muestra el menú de Secretario. |
| 2 | Login con `estudiante` / `Estudiante123` | Entra y muestra el menú de Estudiante. |
| 3 | Login con contraseña incorrecta | 401 y mensaje `{ "mensaje": "..." }`, sin pantalla en blanco. |
| 4 | Entrar a una URL protegida sin loguearse | Redirige al login (`RutaProtegida` funcionando). |
| 5 | Como Estudiante, entrar a una pantalla de Secretario | El botón no se muestra y, si se fuerza la URL, la API responde 403. |
| 6 | Permisos por rol | Cada botón y cada pantalla aparecen solo si el rol tiene el permiso (`usuarios.gestionar`, `estudiantes.inscribir_primero`, `planes.gestionar`, `inscripciones.crear`, etc.). |
| 7 | E1 — usuarios | Listar, crear, editar y dar de baja. La baja es lógica: el registro sigue existiendo con `Activo = false`. |
| 8 | E2 — secretaría | Inscribir un estudiante a 1.º año, ver estudiantes por curso, asignar materias a un docente. |
| 9 | E3 — gestión académica | Crear un plan de estudio, cargar materias, definir una correlatividad. |
| 10 | E4 — inscripciones | Consultar materias disponibles e inscribirse a una de 2.º/3.º. |
| 11 | E4 — correlativas | Intentar inscribirse a una materia con la correlativa sin aprobar: se rechaza con mensaje claro, no con un error 500. |
| 12 | Token vencido | Al expirar el token, la app manda al login en vez de romperse. |
| 13 | Consola del navegador | Sin errores rojos al navegar por las pantallas principales. |

Anotá lo que falle en el mismo PR de promoción o en un issue, asignado al equipo dueño. Los arreglos entran por el flujo normal: el equipo corrige en `eX`, PR a `development`, y se vuelve a promover a `testing`.

---

## 6. Promoción `testing` → `production`

### Cuándo

Solo por **entrega o hito**: presentación de avance, entrega de cuatrimestre, defensa final, o cualquier fecha en la que alguien de afuera del equipo vaya a mirar el sistema. No se promueve "porque sí", ni un rato antes de mostrarlo.

Precondiciones:

- [ ] Toda la checklist de pruebas manuales de la sección 5 pasó sobre `testing`.
- [ ] No quedan errores conocidos que afecten la demo.
- [ ] `testing` estuvo al menos un día sin cambios, para que nadie meta algo de último momento.

### Quién aprueba

**El E1 organiza y aprueba** el PR `testing` → `production`. Lo ideal es que, además de quien abre el PR, otra persona del E1 lo revise antes de mergear. Si el docente a cargo quiere dar el visto bueno, se espera.

### Cómo se hace

```bash
git checkout testing
git pull origin testing
```

En GitHub: **New pull request**, `base: production` ← `compare: testing`. Título: `Release v1.0.0`. Merge con **merge commit**.

### Después del merge: etiquetar la versión

```bash
git checkout production
git pull origin production

# Tag anotado, con mensaje
git tag -a v1.0.0 -m "Primera entrega: login, usuarios, secretaria, plan de estudio e inscripciones"

# Subir el tag (no viaja solo con git push)
git push origin v1.0.0
```

Numeración (versionado semántico, simplificado para el proyecto):

| Cambio | Cuándo se usa |
|---|---|
| `v1.0.0` → `v2.0.0` | Entrega grande, cambio de alcance o del modelo de datos. |
| `v1.0.0` → `v1.1.0` | Funcionalidad nueva de algún equipo. |
| `v1.0.0` → `v1.0.1` | Solo arreglos, típicamente un hotfix. |

Para ver lo que ya existe:

```bash
git tag --list
git show v1.0.0
```

### Después del tag: notas de versión

En GitHub, **Releases → Draft a new release**, elegís el tag `v1.0.0` y escribís las notas. Formato sugerido:

```markdown
## v1.0.0 — Primera entrega (16/09/2026)

### Funcionalidades
- E1: login con JWT, ABM de usuarios, roles y permisos.
- E2: inscripción a 1.º año, listado de estudiantes por curso, asignación de materias a docentes.
- E3: planes de estudio, ABM de materias, carga de correlatividades.
- E4: consulta de materias disponibles e inscripción a 2.º/3.º con validación de correlativas.

### Base de datos
- Migraciones incluidas: Inicial, AgregaEstudianteYDocente,
  AgregaMateriaYCorrelatividad, AgregaInscripcion.
- La base se crea sola al levantar la API por primera vez.

### Cómo levantarlo
Ver README. Usuarios de prueba: secretario / Secretario123 y estudiante / Estudiante123.

### Pendientes conocidos
- El listado de materias no tiene paginado.
- Falta el reporte de inscriptos por comisión (queda para v1.1.0).
```

Los "pendientes conocidos" no son una vergüenza: escribirlos muestra que sabés dónde está parado el proyecto. Ocultarlos y que aparezcan en plena demo, eso sí.

---

## 7. Volver a bajar lo integrado a las ramas de los equipos

**Después de cada promoción**, los cuatro equipos tienen que traerse lo que quedó integrado. Si no, cada uno sigue trabajando sobre una base vieja y los PR siguientes llegan llenos de conflictos.

La rama de referencia para bajar es **`development`**: después de promover a `testing` o a `production`, `development` ya contiene todo. La excepción es el hotfix, que primero hay que reintegrar (sección 8).

Lo puede hacer el integrador para las cuatro ramas, o cada equipo para la suya. Como integrador:

```bash
# Parado en la raíz del repositorio
git fetch origin
git checkout development
git pull origin development

# e1
git checkout e1
git pull origin e1
git merge development
git push origin e1

# e2
git checkout e2
git pull origin e2
git merge development
git push origin e2

# e3
git checkout e3
git pull origin e3
git merge development
git push origin e3

# e4
git checkout e4
git pull origin e4
git merge development
git push origin e4

git checkout development
```

Si alguna de esas ramas tira conflicto, **no lo resuelvas solo**: es código del equipo. Pero ojo, que un merge con conflictos te deja la rama a medio mergear: no alcanza con cerrar la terminal. Cancelalo y seguí con la siguiente:

```bash
git merge --abort          # deja la rama exactamente como estaba antes del merge
git checkout development   # y seguís con el equipo que sigue
```

Después avisale al equipo que corra el merge en su rama y resuelva ellos los conflictos.

Lo que corre cada equipo por su cuenta:

```bash
git checkout e3
git pull origin e3
git fetch origin
git merge origin/development
# resolver conflictos si hay
git push origin e3
```

Avisá siempre que lo hiciste: "Promoví a testing y bajé development a e1..e4, hagan `git pull` de su rama antes de seguir".

---

## 8. Hotfix: algo roto en `production` a mitad de la presentación

Un hotfix es para **algo roto en `production` que no puede esperar** el ciclo normal `eX → development → testing → production`. No es para "aprovecho y agrego una cosita".

Regla: el hotfix sale de `production` y vuelve a `production`, y **después** se reintegra hacia `testing` y `development` para que el arreglo no se pierda en el próximo release.

### Paso 1 — Crear la rama desde `production`

```bash
# Parado en la raíz del repositorio
git fetch origin
git checkout production
git pull origin production

git checkout -b hotfix/login-devuelve-500
```

Nombre: `hotfix/<descripcion-corta-con-guiones>`. Que se entienda qué arregla.

### Paso 2 — Arreglar, compilar y probar

```bash
# ... editar los archivos necesarios ...

# Parado en la raíz del repositorio
cd backend
dotnet build

cd ../frontend
npm install
npm run build

cd ..
```

Levantá el sistema y probá a mano que el problema esté resuelto **y que no rompiste otra cosa**.

```bash
# Parado en la raíz del repositorio
git add .
git commit -m "E1: corrige error 500 en login cuando el usuario esta inactivo"
git push origin hotfix/login-devuelve-500
```

### Paso 3 — PR a `production`

En GitHub: `base: production` ← `compare: hotfix/login-devuelve-500`. Merge con **merge commit**. Lo aprueba el E1, igual que cualquier entrada a `production`.

### Paso 4 — Tag de la versión corregida

```bash
git checkout production
git pull origin production

git tag -a v1.0.1 -m "Hotfix: el login con usuario inactivo devolvia 500"
git push origin v1.0.1
```

### Paso 5 — Reintegrar hacia `testing` y `development`

**Este paso no es opcional.** Si lo salteás, el próximo release de `testing` vuelve a pisar `production` con el bug adentro.

Por PR, que es lo correcto:

- PR `base: testing` ← `compare: production`, título `Reintegra hotfix v1.0.1 a testing`. Merge commit.
- PR `base: development` ← `compare: testing`, título `Reintegra hotfix v1.0.1 a development`. Merge commit.

Si estás en el medio de la presentación y no da para abrir dos PR, dejalos abiertos y mergealos apenas termine, pero **no te vayas del día sin hacerlo**.

### Paso 6 — Bajar a las ramas de los equipos

Lo de la sección 7: `development` hacia `e1`..`e4`.

### Paso 7 — Borrar la rama de hotfix

```bash
git branch -d hotfix/login-devuelve-500
git push origin --delete hotfix/login-devuelve-500
```

---

## 9. `testing` quedó roto y hay que revertir un merge

Si entró un PR a `testing` (o a `development`) y dejó todo roto, y no hay forma rápida de arreglarlo, se revierte el merge. Revertir **no borra historia**: crea un commit nuevo que deshace lo que hizo el merge. Por eso es seguro en ramas compartidas.

### Paso 1 — Encontrar el SHA del merge

```bash
git checkout testing
git pull origin testing
git log --oneline --merges -10
```

Vas a ver algo así:

```
a1b2c3d Merge pull request #17 from gonzaleztomi1978-design/development
9f8e7d6 Merge pull request #16 from gonzaleztomi1978-design/development
```

El SHA que te interesa es el del merge que rompió todo: `a1b2c3d`. Los SHA de tu repositorio van a ser otros: copiá el que te muestre a vos el `git log`, no el del ejemplo.

### Paso 2 — Revertir, pero en una rama aparte

`testing` no acepta push directo, así que el revert **no se hace parado en `testing`**: si lo hacés ahí, el commit te queda trabado en tu máquina y no hay forma de subirlo. Va en una rama nueva que sale de `testing` y después entra por PR, igual que todo lo demás.

```bash
# Seguís parado en testing, recién actualizada en el paso 1
git checkout -b revert/merge-17
git revert -m 1 a1b2c3d
```

**Qué es ese `-m 1`, en criollo.** Un merge commit tiene dos padres: por un lado la historia de la rama donde estabas (`testing`), por el otro la de la rama que entró (`development`). Git no puede adivinar cuál de las dos querés conservar, así que se lo decís vos. `-m 1` significa: "el padre número 1 es la línea buena; dejame `testing` como estaba antes del merge y sacame todo lo que trajo la otra rama". En un merge de PR el padre 1 es **siempre** la rama destino, la que recibió el merge, así que en la práctica **siempre va `-m 1`**. Con `-m 2` harías lo contrario: tirarías a la basura lo que `testing` ya tenía.

Git abre el editor con un mensaje propuesto. Guardalo o ajustalo:

```
E1: revierte el merge #17, rompia el login en testing
```

### Paso 3 — Subir el revert y abrir el PR

```bash
git push origin revert/merge-17
```

PR: `base: testing` ← `compare: revert/merge-17`. Merge con **merge commit**. Avisale al equipo responsable.

> Si te apuraste y corriste el `git revert` parado en `testing`, no pasa nada grave: ese commit está solo en tu máquina. Sacalo con `git checkout testing` y `git reset --hard origin/testing`, y volvé a empezar desde el paso 2. El `reset --hard` tira lo que tengas sin commitear en esa rama, así que usalo únicamente para esto.

### Paso 4 — Volver a meter el trabajo, ya arreglado

Ojo con esto, que es la trampa clásica. El revert quedó vivo en `testing`, pero `development` sigue teniendo el código original. Para Git, esos commits **ya están mergeados** en `testing`, así que en la próxima promoción `development` → `testing` Git trae **solo los commits nuevos del arreglo**, no lo que revertiste. Resultado: `testing` queda con el arreglo pero sin la funcionalidad que el arreglo corrige. Si al promover "no aparece" la funcionalidad, no está fallando Git: es exactamente esto.

La solución es **revertir el revert** antes de volver a promover.

1. El equipo corrige en su rama `eX`, abre PR a `development`, y se prueba ahí como siempre. En `development` **no** se revierte nada.
2. Cuando el arreglo ya está en `development`, en vez del PR de promoción normal armás una rama que deshace el revert y trae el arreglo:

```bash
git fetch origin
git checkout -b promocion/reintegra-merge-17 origin/testing

# Buscá el commit del revert del paso 2: es el que empieza con "Revert"
git log --oneline -10 origin/testing

# Deshacé ese revert (acá va el SHA del commit "Revert ...", NO el del merge original)
git revert SHA-DEL-COMMIT-REVERT

# Traé el arreglo que ya está integrado en development
git merge origin/development

git push origin promocion/reintegra-merge-17
```

3. PR: `base: testing` ← `compare: promocion/reintegra-merge-17`. Merge con **merge commit**, y pasá la checklist de pruebas manuales de la sección 5 como en cualquier promoción.

Ese `git revert` no lleva `-m 1`, porque el commit del revert es un commit común, no un merge. Después de esto, `testing` y `development` vuelven a estar alineadas y las promociones siguientes son normales.

---

## 10. Ritmo sugerido para el cuatrimestre

| Cuándo | Qué pasa | Quién |
|---|---|---|
| Cuando una funcionalidad está lista y probada | El equipo abre PR `eX` → `development`. No se acumulan tres semanas de trabajo en un PR gigante. | Cada equipo |
| Todos los días, o cuando llega un PR | El integrador revisa los PR abiertos hacia `development`: pide cambios o mergea. | E1 |
| Semanal, día fijo (ej.: miércoles) | Promoción `development` → `testing` y checklist de pruebas manuales. | E1 |
| Semanal, después de promover | Bajar `development` a `e1`..`e4` y avisar a los equipos. | E1 |
| Por entrega o hito | Promoción `testing` → `production`, tag `vX.Y.Z` y notas de versión. | E1 (aprueba) |
| Cuando se rompe algo en `production` | `hotfix/<descripcion>` y reintegración hacia `testing` y `development`. | E1 |
| Antes de cada hito grande | Revisar `docs/mesa-tecnica.md`: entidades pendientes, contratos de API, decisiones sin cerrar. | Mesa Técnica |

Dos consejos que valen más que el calendario:

1. **PR chicos y seguido.** Un PR de cuarenta archivos no lo revisa nadie de verdad, y los conflictos que genera se comen dos días.
2. **No promuevas nada el mismo día de la entrega.** Si la demo es el jueves, `production` tiene que estar lista el martes.

---

## 11. Tabla resumen

| Acción | Rama origen | Rama destino | Quién | Cómo |
|---|---|---|---|---|
| Trabajo diario del equipo | — | `e1` / `e2` / `e3` / `e4` | Integrantes del equipo | `git push origin eX` (directo) |
| Traer lo integrado antes de seguir | `development` | `eX` | Cada equipo | `git merge origin/development` y push |
| Integrar una funcionalidad | `eX` | `development` | Lo abre el equipo, lo mergea el E1 | PR con merge commit, después de la checklist de la sección 2 |
| Cortar versión candidata | `development` | `testing` | E1 | PR con merge commit + checklist de pruebas manuales |
| Publicar versión estable | `testing` | `production` | E1 (organiza y aprueba) | PR con merge commit + `git tag -a vX.Y.Z` + notas de versión |
| Bajar lo integrado a los equipos | `development` | `e1`..`e4` | E1, o cada equipo | `git merge development` en cada rama y push |
| Arreglo urgente en producción | `production` | `hotfix/<desc>` y de vuelta a `production` | E1 | PR con merge commit + tag de patch (`v1.0.1`) |
| Reintegrar un hotfix | `production` | `testing`, y después `development` | E1 | Dos PR con merge commit |
| Deshacer un merge que rompió todo | `testing` (o `development`) | la misma rama | E1 | `git revert -m 1 <sha>` en una rama `revert/...` + PR |
| Volver a meter lo revertido, ya arreglado | `testing` + `development` | `testing` | E1 | Rama `promocion/reintegra-...`: revertir el revert, mergear `development` y PR (sección 9, paso 4) |

---

## Recordatorios finales

- Nunca `git push` directo a `development`, `testing` ni `production`.
- Siempre merge commit. Nunca squash ni rebase en ramas compartidas.
- Los tags se pushean aparte: `git push origin v1.0.0`.
- Si un PR no cumple, se piden cambios en el PR. No se arregla por afuera ni se mergea "por ahora".
- Después de cada promoción, bajá `development` a las cuatro ramas de equipo y avisá.
- Si dudás entre frenar un merge o dejar `production` en riesgo, frená el merge.
