## ¿Qué hace este PR?

<!-- Descripción breve y concreta de la funcionalidad, el arreglo o el ajuste.
     Si suma endpoints o pantallas nuevas, nombralos. -->

## Equipo

<!-- Marcá el equipo que abre el PR -->

- [ ] E1 — Acceso e Integración
- [ ] E2 — Secretaría
- [ ] E3 — Gestión Académica
- [ ] E4 — Inscripciones

## Rama origen y destino

| | Rama |
|---|---|
| **compare** (de dónde vienen los cambios) | `e1` / `e2` / `e3` / `e4` |
| **base** (a dónde van) | `development` |

Ejemplo: **compare `e2`** → **base `development`**.

> Los PR de equipo van **siempre** a `development`. Las promociones a `testing` y a `production` las abre el E1
> con las otras plantillas (mirá la nota del final).

## Issues o tareas relacionadas

<!-- Ej: Closes #12 / Relacionado con #7 / Tarea de la Mesa Técnica: definir entidad Materia.
     Si no hay issue, escribí a qué tarea del equipo corresponde. -->

## Checklist

- [ ] Compila sin errores: `dotnet build` en `backend/` y `npm run build` en `frontend/`
- [ ] Probé la funcionalidad a mano (backend levantado y pantalla abierta en el navegador)
- [ ] No subí connection strings personales, `.env`, `node_modules/`, `bin/` ni `obj/`
- [ ] Si agregué o modifiqué entidades o migraciones, lo acordé antes con la Mesa Técnica (`docs/mesa-tecnica.md`)
- [ ] Mergeé `development` en mi rama y resolví los conflictos antes de abrir el PR
- [ ] El PR apunta a `development` (nunca a `testing` ni a `production`)
- [ ] Mis commits usan el prefijo del equipo (`E1:` / `E2:` / `E3:` / `E4:`)

Para el punto del merge (el ejemplo usa `e2`: cambiá la rama por la de tu equipo):

```bash
git checkout e2               # tu rama: e1, e2, e3 o e4
git pull origin e2            # traés lo que subieron tus compañeros de equipo
git fetch origin              # actualizás la foto local de development (sin esto mergeás algo viejo)
git merge origin/development  # traés lo ya integrado de los otros equipos
# Si hay conflictos: resolvelos en el editor y después
#   git add ARCHIVO-QUE-RESOLVISTE
#   git commit
git push origin e2
```

## Capturas / evidencia

<!-- Arrastrá acá las capturas de las pantallas nuevas o de la respuesta de Swagger.
     Si el cambio es solo de backend, alcanza con la captura de Swagger o del resultado del endpoint. -->

---

### Otras plantillas (solo E1)

Las promociones entre ramas tienen su propia plantilla, guardada en `.github/PULL_REQUEST_TEMPLATE/`.
Ojo con esto: GitHub **no** muestra un selector de plantillas al abrir un Pull Request (eso existe solo
para los issues). La única forma de elegirla es abrir el PR con el parámetro `template=` en la URL.

Pegá la URL en el navegador:

| PR | URL para abrirlo |
|---|---|
| `development` → `testing` | `https://github.com/gonzaleztomi1978-design/Sistema-Academico/compare/testing...development?expand=1&template=promocion-a-testing.md` |
| `testing` → `production` | `https://github.com/gonzaleztomi1978-design/Sistema-Academico/compare/production...testing?expand=1&template=promocion-a-production.md` |

La URL de comparación se lee `compare/<base>...<compare>`: primero la rama de destino y después la rama
de donde vienen los cambios. Si en cambio abriste el PR desde la interfaz y querés sumarle la plantilla,
agregale `&template=promocion-a-testing.md` al final de la URL (con `&` porque ya hay otros parámetros;
si la URL no tuviera ninguno, va con `?`) y recargá la página. Cuidado: al recargar se pierde lo que hayas
escrito en la descripción, así que elegí la plantilla antes de empezar a completarla.
