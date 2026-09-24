## Promoción a `production`

**compare `testing`** → **base `production`**

Este PR lleva la versión candidata ya probada a `production`, que es la rama estable y presentable
(y la rama por defecto del repositorio). Lo abre y lo aprueba el E1.

## Versión que se va a etiquetar

`vX.Y.Z`

<!-- Regla simple, formato X.Y.Z:
     - X: queda en 1 toda la cursada. Solo se sube si la Mesa Técnica decide un cambio grande.
     - Y: se sube cuando entran funcionalidades nuevas (ejemplo: v1.2.0 -> v1.3.0).
     - Z: se sube cuando son solo arreglos (ejemplo: v1.2.0 -> v1.2.1).
     La primera entrega es v1.0.0. Al subir Y, Z vuelve a 0. -->

## Resumen de funcionalidades por equipo

<!-- Qué queda funcionando en esta versión, contado en criollo. Sirve como base de las notas de versión. -->

| Equipo | Qué queda funcionando en esta versión |
|---|---|
| E1 — Acceso e Integración | |
| E2 — Secretaría | |
| E3 — Gestión Académica | |
| E4 — Inscripciones | |

## Confirmación de que `testing` pasó las pruebas

- [ ] Se corrieron todas las pruebas manuales del PR de promoción a `testing` y pasaron
- [ ] Los riesgos que quedaron abiertos en ese PR se resolvieron o están documentados acá abajo

PR de promoción a `testing`: #

Riesgos que siguen abiertos: <!-- ninguno / detallar -->

## Checklist de cierre

- [ ] El workflow **CI** está en verde sobre `testing` y sobre este PR
- [ ] `npm run build` pasa sin errores
- [ ] No hay archivos de configuración personal ni `node_modules/` en el diff
- [ ] El `README.md` está actualizado
- [ ] Los documentos de `documentos/` están actualizados
- [ ] Después de mergear, se crea el tag `vX.Y.Z` sobre `production`

El tag se crea **después** de mergear el PR, para que apunte al commit de merge.
El ejemplo usa `v1.0.0`: poné la misma versión que declaraste arriba.

```bash
git checkout production
git pull origin production    # traés el merge que acabás de hacer en GitHub
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0        # sin esto el tag queda solo en tu máquina
```

## Notas de versión para la entrega

<!-- Texto final que se muestra en la entrega. Escribilo para que lo entienda alguien que no vio el código. -->

**Versión:** vX.Y.Z
**Fecha:** <!-- dd/mm/aaaa -->

**Novedades**

-
-

**Arreglos**

-
-

**Limitaciones conocidas**

-

## Capturas / evidencia

<!-- Capturas del sistema funcionando, para la entrega. -->
