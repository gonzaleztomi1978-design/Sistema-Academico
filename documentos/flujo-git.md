# Flujo de trabajo con Git — E1, E2, E3 y E4

Este es el manual del día a día. Si te sentás a laburar y no te acordás qué comando va, abrí este archivo y seguí los pasos de arriba hacia abajo.

Vale para los cuatro equipos. Los ejemplos usan la rama `e2`: si sos del E1, E3 o E4, cambiá `e2` por `e1`, `e3` o `e4`.

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

El código viaja siempre en una sola dirección y **nunca salteando un escalón**.

| Rama | Para qué sirve | Quién pushea |
|---|---|---|
| `e1` | Trabajo diario del E1 (login, usuarios, roles, permisos, integración). | Integrantes del E1, directo. |
| `e2` | Trabajo diario del E2 (inscripción a 1.º, comisiones, docentes). | Integrantes del E2, directo. |
| `e3` | Trabajo diario del E3 (planes de estudio, materias, correlatividades). | Integrantes del E3, directo. |
| `e4` | Trabajo diario del E4 (consulta de materias, inscripciones a 2.º/3.º). | Integrantes del E4, directo. |
| `development` | Integración diaria: acá se junta el trabajo de los cuatro equipos. | **Nadie directo.** Solo PR desde `e1`..`e4`. Lo mergea el E1. |
| `testing` | Versión candidata: se prueba el sistema completo. | **Nadie directo.** Solo PR desde `development`. |
| `production` | Versión estable y presentable. Rama por defecto del repositorio. | **Nadie directo.** Solo PR desde `testing`. |

---

## 2. Preparar la máquina la primera vez

Esto se hace **una sola vez por computadora**.

### 2.1. Clonar el repositorio

```bash
git clone https://github.com/gonzaleztomi1978-design/Sistema-Academico.git
cd Sistema-Academico
```

Si te pide usuario y contraseña, la contraseña de GitHub **no sirve**: va un token personal. Está explicado en [configuracion-github.md, sección 9](configuracion-github.md#9-problemas-frecuentes). Si te rechaza por permisos, pedile al E1 que te invite como colaborador.

Al clonar quedás parado en `production`, que es la rama por defecto. **No trabajes ahí.**

### 2.2. Configurar tu nombre, tu mail y el editor

Poné tu nombre real y el mail de tu cuenta de GitHub. Es lo que va a aparecer en cada commit.

```bash
git config user.name "Nombre Apellido"
git config user.email "tumail@ejemplo.com"
```

Configurá también VS Code como editor. Si no lo hacés, Git para Windows abre **Vim** cada vez que necesita un mensaje, y es muy fácil quedar trabado ahí adentro:

```bash
git config --global core.editor "code --wait"
```

Con eso, cuando Git pida un mensaje se abre una pestaña de VS Code: la guardás, la cerrás, y Git sigue solo.

### 2.3. Traer todas las ramas

```bash
git fetch --all
git branch -a
```

Además de las locales tenés que ver las remotas: `remotes/origin/e1` a `remotes/origin/e4`, `remotes/origin/development`, `remotes/origin/testing` y `remotes/origin/production`.

### 2.4. Pararte en la rama de tu equipo

```bash
git switch e2
```

Si te dice que esa rama no existe localmente, creála siguiendo a la remota:

```bash
git checkout -b e2 origin/e2
```

Confirmá dónde estás parado. Tiene que decir `e2`:

```bash
git branch --show-current
```

### 2.5. Dejar el proyecto andando

Necesitás Node.js 20 o superior. Parado en la raíz del repositorio:

```bash
npm install
npm run dev
```

Queda en http://localhost:5173. Para cambiar entre Secretario y Estudiante, usá el simulador de roles de la pantalla.

---

## 3. El ciclo de trabajo diario

Estos cinco pasos son el día entero. Hacelos en orden, todas las veces.

### Paso 1 — Pararte en tu rama y traer lo de tus compañeros

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
- Si te abre un editor pidiendo el mensaje de merge, dejá el que propone, guardá y cerrá.
- Si aparecen conflictos, andá a la sección 6 y resolvelos ahora, antes de arrancar la tarea nueva.

Después del merge, subí tu rama ya actualizada:

```bash
git push origin e2
```

> ¿Por qué el `git fetch`? Porque `git pull origin e2` actualiza **solo** `e2`. Sin el fetch, `origin/development` sigue siendo la foto que bajaste la última vez, y estarías mergeando código viejo sin que Git te avise.

### Paso 3 — Trabajar

Escribí tu código **en la carpeta de tu equipo**:

| Equipo | Dónde crea sus pantallas |
|---|---|
| E1 | `src/core/`, `src/api/`, `src/hooks/` |
| E2 | `src/modules/secretario/pages/Docentes/`, `src/modules/secretario/pages/Inscripciones/` |
| E3 | `src/modules/secretario/pages/PlanesEstudio/` |
| E4 | `src/modules/estudiante/pages/Inscripciones/` |

Los componentes propios de cada pantalla van en la subcarpeta `components/` de ese módulo. Cada tanto, mirá cómo venís:

```bash
git status
git diff
```

### Paso 4 — Commitear con la convención

```bash
git status
git add .
git commit -m "E2: agrega alta de docentes"
```

Mirá el `git status` **antes** del `git add .`. Si aparece algo que no reconocés, no lo agregues: preguntá.

El prefijo es el de **tu** equipo (`E1:`, `E2:`, `E3:` o `E4:`) y la descripción va corta y en presente.

| Bien | Mal |
|---|---|
| `E2: agrega alta de docentes` | `cambios` |
| `E3: corrige validación de correlativas` | `E3: arreglé un par de cosas del otro día` |
| `E4: lista materias disponibles por estudiante` | `wip` |

Commiteá seguido y chico: un commit por cosa terminada, no uno gigante al final del día.

### Paso 5 — Verificar que compila y subir

Parado en la raíz del repositorio:

```bash
npm run build
```

Tiene que terminar sin errores. Si falla, arreglalo ahora: no sirve de nada subir algo que no compila.

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
git commit -m "E2: agrega alta de docentes"
npm run build
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
4. Revisá la lista de archivos modificados. Si ves archivos que vos no tocaste, frená y avisale al E1.
5. Completá la plantilla que aparece sola en la descripción. No tildes lo que no hiciste: el E1 lo verifica igual.
6. Título del PR: mismo estilo que los commits, por ejemplo `E2: alta de docentes`.
7. **Create pull request**.

### Los checks automáticos

Apenas abrís el PR, y también en cada push a tu rama, GitHub corre solo el workflow de integración continua. Instala las dependencias, pasa el lint, corre los tests y compila.

| Paso | ¿Bloquea? |
|---|---|
| Instalar dependencias (`npm ci`) | Sí |
| Lint (ESLint) | No, pero miralo y arreglalo |
| Tests (Vitest) | Sí |
| Compilar (`npm run build`) | Sí |

Si un check sale en rojo, el PR no se mergea: abrí **Details**, leé en qué paso falló, corregí en tu rama y volvé a pushear. El PR se actualiza solo.

### Qué hace el E1 con ese PR

- Revisa que el código respete la estructura de carpetas y las convenciones de `continuacion.md`.
- Mira que los checks estén en verde y que no vengan archivos de más.
- Si hay conflictos, **te lo devuelve para que los resuelvas en tu rama** (sección 6).
- Si está todo bien, lo mergea a `development`.

Después de que te mergearon el PR, volvé al Paso 2 para bajar a tu rama lo que quedó integrado.

---

## 5. Antes de pedir la revisión, chequeá

- [ ] Estoy parado en la rama de mi equipo (`git branch --show-current`).
- [ ] Hice `git fetch origin` y `git merge origin/development`, y no quedaron conflictos.
- [ ] `npm run build` pasa sin errores.
- [ ] Probé la funcionalidad a mano en el navegador.
- [ ] Mis commits tienen el prefijo del equipo.
- [ ] No subí `node_modules/`, `dist/` ni archivos `.env`.

---

## 6. Resolver conflictos

Un conflicto aparece cuando dos equipos tocaron el mismo archivo en las mismas líneas. Es normal y no rompe nada: hay que decidir qué queda.

**Regla del proyecto: los conflictos se resuelven en la rama del equipo, en tu máquina. No con el botón "Resolve conflicts" de GitHub**, porque desde ahí no podés compilar ni probar.

### 6.1. El procedimiento

```bash
git switch e2
git pull origin e2
git fetch origin
git merge origin/development
```

Si hay conflicto, Git te avisa así:

```
Auto-merging src/core/layouts/Sidebar.jsx
CONFLICT (content): Merge conflict in src/core/layouts/Sidebar.jsx
Automatic merge failed; fix conflicts and then commit the result.
```

### 6.2. Ver qué archivos están en conflicto

```bash
git status
git diff --name-only --diff-filter=U    # solo la lista pelada
```

### 6.3. Cómo se ven los marcadores

Abrí el archivo en VS Code. Vas a encontrar bloques así:

```jsx
<<<<<<< HEAD
    { label: 'Docentes', path: '/secretario/docentes', icon: 'UserRound' },
=======
    { label: 'Materias', path: '/secretario/materias', icon: 'GraduationCap' },
>>>>>>> origin/development
```

- Entre `<<<<<<< HEAD` y `=======` está **lo tuyo**, lo que hay en `e2`.
- Entre `=======` y `>>>>>>> origin/development` está **lo de los otros equipos**.

Editá hasta que quede bien y **borrá las tres líneas de marcadores**. Si te queda una suelta, el proyecto no compila.

### 6.4. Cerrar el merge

```bash
# 1. Marcar cada archivo como resuelto
git add src/core/layouts/Sidebar.jsx

# 2. Cuando no queda ninguno, cerrar el merge
git status          # no tiene que quedar nada en "Unmerged paths"
git commit          # se abre con un mensaje ya escrito: guardá y cerrá

# 3. Verificar que sigue compilando
npm run build

# 4. Subir la rama ya resuelta
git push origin e2
```

Con ese push, el Pull Request que tenías abierto se actualiza solo y deja de mostrar conflictos.

> ¿Te perdiste en el medio? `git merge --abort` deja todo como estaba antes del merge. No perdés tu trabajo commiteado.

---

## 7. Los conflictos típicos de este proyecto

Los cuatro equipos comparten unos pocos archivos. Ahí es donde van a chocar, y en **todos** la regla es la misma: **se quedan las dos partes, nunca borres lo del otro equipo.**

### 7.1. El menú lateral — `src/core/layouts/Sidebar.jsx`

Es el conflicto más frecuente: cada equipo agrega su ítem al menú, en el objeto `MENU_POR_ROL`.

Conflicto:

```jsx
<<<<<<< HEAD
    { label: 'Docentes', path: '/secretario/docentes', icon: 'UserRound' },
=======
    { label: 'Materias', path: '/secretario/materias', icon: 'GraduationCap' },
>>>>>>> origin/development
```

Resuelto, **con los dos ítems**:

```jsx
    { label: 'Docentes', path: '/secretario/docentes', icon: 'UserRound' },
    { label: 'Materias', path: '/secretario/materias', icon: 'GraduationCap' },
```

Ojo con el `import` de iconos de arriba del archivo: si los dos equipos agregaron uno, se quedan los dos y van en orden alfabético dentro de las llaves.

### 7.2. Las rutas — `secretarioRoutes.jsx` y `estudianteRoutes.jsx`

Pasa lo mismo: cada equipo suma su `<Route>` y su `lazy(() => import(...))`.

Resuelto queda así, con las dos cosas de cada equipo:

```jsx
const Docentes = lazy(() => import('./pages/Docentes/Docentes'));
const Materias = lazy(() => import('./pages/Materias/Materias'));
```

```jsx
    <Route path="docentes" element={withSuspense(Docentes)} />
    <Route path="materias" element={withSuspense(Materias)} />
```

Después de resolver, corré `npm run build` y probá que las dos pantallas abran.

### 7.3. Datos y estilos compartidos

En `src/data/managementData.js` y en los archivos de `src/styles/` vale la misma regla: se quedan los dos bloques. Si dos equipos definieron **la misma clase CSS** con contenido distinto, no lo resuelvas solo: hablalo con el otro equipo y avisale al E1, porque ahí hay que renombrar una.

### 7.4. `package-lock.json` — se acepta el de development

Ese archivo lo genera npm solo y tiene miles de líneas. **Nunca se edita a mano.**

```bash
git checkout --theirs package-lock.json
git add package-lock.json
npm install
```

Si vos habías agregado un paquete, después del `npm install` fijate que siga figurando en `package.json`. Si el merge se lo llevó puesto, volvé a agregarlo con `npm install <paquete>` y commiteá los dos archivos juntos.

> Instalar un paquete nuevo se avisa en la Mesa Técnica antes. Si cada equipo suma librerías por su cuenta, el proyecto se vuelve imposible de mantener.

Cerrá siempre con `npm run build`.

---

## 8. Reglas de oro

1. **Nunca** pushees directo a `development`, `testing` ni `production`. Todo entra por Pull Request.
2. **Nunca** uses `git push --force`. Si el push te rebota, se arregla con `git pull`, no a la fuerza.
3. **Nunca** commitees `node_modules/` ni `dist/`. Ya están en el `.gitignore`: si te aparecen en el `git status`, algo hiciste mal.
4. **Nunca** subas claves ni archivos `.env`.
5. **Nunca** toques archivos de otro equipo sin avisar. Los compartidos se tocan solo para agregar lo tuyo.
6. **Siempre** `git fetch origin` y `git merge origin/development` antes de arrancar algo nuevo.
7. **Siempre** `npm run build` antes de abrir un PR.
8. Si algo no te cierra, preguntá antes de ejecutar. Un comando mal tirado le cuesta la tarde a los cuatro equipos.

---

## 9. Si te pasa esto, hacé esto

### Te rechaza el push por non-fast-forward

```
! [rejected]        e2 -> e2 (non-fast-forward)
hint: Updates were rejected because the tip of your current branch is behind
```

Un compañero subió algo a `e2` después de tu último `pull`. No es un error tuyo y **no se arregla con `--force`**.

```bash
git pull origin e2      # trae lo de tu compañero y lo mergea con lo tuyo
# si aparecen conflictos, resolvelos como dice la sección 6
git push origin e2
```

### Commiteaste en la rama equivocada

```bash
# 1. Parado todavía en la rama equivocada, anotá el hash del commit
git log --oneline -3

# 2. Pasate a tu rama y traelo
git switch e2
git cherry-pick HASH-DEL-COMMIT
git push origin e2

# 3. Volvé a la rama equivocada y dejala igual que en GitHub
git switch development
git fetch origin
git reset --hard origin/development
```

> Ese `reset --hard` es seguro **solo** si no llegaste a pushear (y a esas ramas no tenés que poder pushear). Si ya pusheaste a una rama protegida, avisale al E1.

### Querés descartar cambios locales

```bash
git restore src/modules/secretario/pages/Docentes/Docentes.jsx   # un archivo
git restore .                                                     # todos los cambios sin commitear
```

> `restore` y `reset --hard` **no se pueden deshacer**. Si dudás, guardá lo que tenés con `git stash` y recuperalo después con `git stash pop`.

### Te olvidaste de mergear development y ya trabajaste un montón

No pasa nada, se hace ahora. Commiteá primero lo que tengas suelto.

```bash
git switch e2
git add .
git commit -m "E2: guarda avance de docentes"
git fetch origin
git merge origin/development
# resolvé los conflictos que aparezcan (secciones 6 y 7)
git push origin e2
```

### El proyecto no levanta o tira errores raros de dependencias

Casi siempre es que llegó un `package-lock.json` nuevo y tu `node_modules` quedó viejo:

```bash
npm install
```

### No sabés en qué rama estás ni qué tenés sin subir

```bash
git branch --show-current
git status
git log --oneline --graph --all -15
```

---

## 10. Chuleta de comandos

| Qué querés hacer | Comando |
|---|---|
| Ver en qué rama estás | `git branch --show-current` |
| Ver todas las ramas | `git branch -a` |
| Traer info del remoto sin tocar tus archivos | `git fetch origin` |
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
| Levantar el proyecto | `npm run dev` |
| Compilar | `npm run build` |
| Reinstalar dependencias | `npm install` |

---

Dudas de Git, ramas, PR o conflictos: preguntale al **E1**, que es el equipo de Acceso e Integración y el que mergea hacia `development`, `testing` y `production`.
