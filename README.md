# Sistema Académico — Instituto Superior Cura Gabriel Brochero

Proyecto de Prácticas Profesionalizantes. Lo desarrollan 4 equipos sobre esta misma base.

El sistema tiene dos perfiles: **Secretario** y **Estudiante**.

---

## Las 5 reglas que no se rompen

1. **Nunca** pushear directo a `development`, `testing` ni `production`.
2. **Nunca** subir `node_modules/` ni `dist/`. Se generan solos.
3. **Nunca** usar `git push --force`. Le rompe el repositorio a todos.
4. Antes de abrir un Pull Request, `npm run build` tiene que pasar sin errores.
5. Los conflictos los resolvés **en tu rama**, en tu máquina. No con el botón de GitHub.

## Arrancar en 3 pasos

```bash
git clone https://github.com/gonzaleztomi1978-design/Sistema-Academico.git
cd Sistema-Academico
npm install
npm run dev
```

Se abre en **http://localhost:5173**. Necesitás **Node.js 20 o superior**.

Todavía no hay login. Para cambiar entre Secretario y Estudiante usá el **simulador de roles** que aparece en pantalla.

---

## Comandos que vas a usar

| Comando | Para qué |
|---|---|
| `npm run dev` | Levantar el proyecto mientras trabajás. |
| `npm run build` | Compilar. **Tiene que pasar antes de abrir un Pull Request.** |
| `npm run lint` | Ver problemas de estilo del código. |
| `npm test` | Correr los tests. |

---

## Dónde va tu código

```
src/
├── core/        → layout, menú y ruteo. Lo mantiene el E1.
├── api/         → acceso a datos. Hoy son datos simulados. Lo mantiene el E1.
├── hooks/       → funciones reutilizables (useCrud). Lo mantiene el E1.
├── modules/
│   ├── secretario/pages/   → pantallas del Secretario (E2 y E3)
│   └── estudiante/pages/   → pantallas del Estudiante (E4)
└── styles/      → estilos compartidos
```

| Equipo | Qué hace | Su rama | Dónde trabaja |
|---|---|---|---|
| **E1** — Acceso e Integración | Login, usuarios, roles, permisos, integrar todo | `e1` | `src/core/`, `src/api/`, `src/hooks/` |
| **E2** — Secretaría | Inscripción a 1.º año, docentes, estudiantes por comisión | `e2` | `src/modules/secretario/pages/Docentes/` e `.../Inscripciones/` |
| **E3** — Gestión Académica | Planes de estudio, materias, correlatividades | `e3` | `src/modules/secretario/pages/PlanesEstudio/` |
| **E4** — Inscripciones | Consulta de materias e inscripción a 2.º y 3.º | `e4` | `src/modules/estudiante/pages/Inscripciones/` |

Cada equipo crea sus pantallas **en su propia carpeta**. Los archivos compartidos se tocan solo para agregar lo propio, nunca para cambiar lo de otro.

---

## Las ramas

```
    e1 ─┐
    e2 ─┤
    e3 ─┼─ PR ─> development ─ PR ─> testing ─ PR ─> production
    e4 ─┘
```

| Rama | Qué es | ¿Podés pushear? |
|---|---|---|
| `e1` `e2` `e3` `e4` | La rama de tu equipo. Acá trabajás todos los días. | **Sí**, directo. |
| `development` | Donde se junta el trabajo de los 4 equipos. | No. Solo por Pull Request. |
| `testing` | Versión candidata: se prueba entera antes de darla por buena. | No. Solo por Pull Request. |
| `production` | Versión estable. Es lo que se muestra y se entrega. | No. Solo por Pull Request. |

El E1 es el que mergea hacia `development`, `testing` y `production`.

---

## Tu día a día con Git

```bash
# 1. Pararte en tu rama y traer lo último de tus compañeros
git checkout e2
git pull origin e2

# 2. Traer lo que ya integraron los otros equipos
git fetch origin
git merge origin/development

# 3. Trabajar, y cuando terminás algo:
git status
git add .
git commit -m "E2: inscripción de estudiantes a primer año"
git push origin e2
```

Después abrís el Pull Request en GitHub con **base `development`** y **compare `e2`**.

Dos cosas importantes:

- El paso 2 **no es opcional**. Sin el `git fetch` estarías mergeando una copia vieja.
- Los mensajes de commit empiezan con tu equipo: `E2: descripción corta en presente`.

Guía completa, con los conflictos típicos y cómo salir de cada problema: [documentos/flujo-git.md](documentos/flujo-git.md).

---



---

## Documentación

**De la cátedra**

- [Sistema Académico](documentos/Sistema%20Acad%C3%A9mico.md) — qué tiene que hacer el sistema.
- [Equipos Proyectos 2do](documentos/Equipos%20Proyectos%202do.md) — integrantes y responsabilidades de cada equipo.
- [continuacion.md](documentos/continuacion.md) — arquitectura del proyecto y convenciones de código.
- [diagrama UML](documentos/diagrama_uml_Sistema_Acad%C3%A9mico.md) — diagrama del sistema.

**De Git (las arma el E1)**

- [flujo-git.md](documentos/flujo-git.md) — trabajo diario de los equipos.
- [integracion-y-releases.md](documentos/integracion-y-releases.md) — cómo integra y promueve el E1.
- [configuracion-github.md](documentos/configuracion-github.md) — configuración del repositorio en GitHub.

---



