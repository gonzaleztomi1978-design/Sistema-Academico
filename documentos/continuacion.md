# Guía de Continuidad del Sistema Académico

## 1. Estado actual del proyecto

El proyecto cuenta con una base funcional de frontend en React + Vite para un sistema académico con dos perfiles principales: secretario y estudiante. La arquitectura actual está organizada por módulos de dominio y por roles, y no depende de un backend real: la persistencia y las interacciones se simulan con repositorios mock en memoria y hooks reutilizables.

Actualmente la aplicación contempla:

- Inicio general.
- Gestión de planes de estudio.
- Gestión de docentes.
- Inscripciones académicas.
- Vista del estudiante con acceso a sus inscripciones.
- Cambio de rol simulado para validar la navegación por perfil.

La capa de acceso a datos se encuentra desacoplada de la UI mediante adaptadores mock y utilidades de CRUD, lo que permite migrar a una API real sin afectar la lógica de las pantallas.

## 2. Estructura real del frontend

La estructura actual del repositorio refleja la implementación real del sistema, y no coincide con una organización todavía basada en `src/features` ni con una distribución por carpetas genéricas de páginas y componentes sueltos. La base actual es la siguiente:

```text
Sistema Académico/
├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js
├── eslint.config.js
├── documentos/
│   ├── Sistema Académico.md
│   ├── Equipos Proyectos 2do.md
│   └── continuacion.md
├── src/
│   ├── main.jsx
│   ├── api/
│   │   ├── createMockRepository.js
│   │   └── httpClient.js
│   ├── assets/
│   ├── core/
│   │   ├── components/
│   │   │   ├── SimuladorRoles.jsx
│   │   │   └── ui/
│   │   │       └── ManagementTable.jsx
│   │   ├── layouts/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── router/
│   │   │   └── withSuspense.jsx
│   │   └── routes/
│   │       └── App.jsx
│   ├── data/
│   │   └── managementData.js
│   ├── hooks/
│   │   ├── useAsyncResource.js
│   │   └── useCrud.js
│   ├── modules/
│   │   ├── estudiante/
│   │   │   ├── estudianteRoutes.jsx
│   │   │   ├── components/
│   │   │   │   └── enrollments/
│   │   │   │       └── useEnrollments.js
│   │   │   └── pages/
│   │   │       ├── Inicio/
│   │   │       │   └── HomePage.jsx
│   │   │       └── Inscripciones/
│   │   │           ├── InscripcionesEstudiante.jsx
│   │   │           └── components/
│   │   │               └── MateriaInscripcionCard.jsx
│   │   └── secretario/
│   │       ├── secretarioRoutes.jsx
│   │       ├── components/
│   │       │   ├── enrollments/
│   │       │   │   └── useEnrollments.js
│   │       │   ├── plans/
│   │       │   │   └── plansApi.js
│   │       │   └── teachers/
│   │       │       └── teachersApi.js
│   │       └── pages/
│   │           ├── Docentes/
│   │           │   ├── Docentes.jsx
│   │           │   └── ManagementPage.jsx
│   │           ├── Inicio/
│   │           │   └── HomePage.jsx
│   │           ├── Inscripciones/
│   │           │   ├── InscripcionesContainer.jsx
│   │           │   └── components/
│   │           │       └── YearCard.jsx
│   │           └── PlanesEstudio/
│   │               ├── PlanCard.jsx
│   │               └── PlanesEstudio.jsx
│   ├── styles/
│   │   ├── base.css
│   │   ├── enrollments.css
│   │   ├── globals.css
│   │   ├── index.css
│   │   ├── layout.css
│   │   ├── management.css
│   │   ├── navigation.css
│   │   ├── plans.css
│   │   ├── student.css
│   │   └── tokens.css
│   └── utils/ (si se agrega en desarrollo futuro)
└── node_modules/
```

> Los directorios `dist/` y `node_modules/` se generan automáticamente y no deben versionarse ni editarse manualmente.

## 3. Patrón arquitectónico actual

La aplicación usa una separación funcional por roles y por módulos, con un shell global compartido:

- `src/core/routes/App.jsx`: punto central de ruteo y selector de rol simulado.
- `src/modules/secretario/secretarioRoutes.jsx`: rutas del rol secretario.
- `src/modules/estudiante/estudianteRoutes.jsx`: rutas del rol estudiante.
- `src/core/layouts/AppLayout.jsx`: layout base del dashboard con sidebar y header.
- `src/modules/.../pages`: pantallas específicas del dominio.
- `src/modules/.../components`: componentes orientados al dominio.
- `src/hooks/useCrud.js`: patrón reusable para carga y mutaciones de registros.
- `src/api/createMockRepository.js`: repositorio en memoria con comportamiento CRUD simulando backend.

La navegación actual no se define en un único archivo global de páginas, sino en archivos de rutas asociados a cada módulo, y la selección del rol se resuelve desde un simulador de interfaz. Ese patrón debe mantenerse como base para continuar creciendo.

## 4. Cómo se integra la capa de datos

El flujo de acceso a datos actual sigue un patrón claro:

```js
const repository = createMockRepository(seed);
const data = await repository.list();
await repository.create(payload);
await repository.update(id, changes);
await repository.remove(id);
```

Y la capa de negocio reutiliza el hook:

```js
const { rows, isLoading, error, create, remove, reload } = useCrud({
  api,
  createPayload,
  validate,
  entityLabel,
});
```

Esto permite que la UI no dependa directamente de arreglos o datos estáticos, y que el reemplazo por una API real signifique cambiar la implementación del adaptador, no la lógica de cada pantalla.

## 5. Arquitectura recomendada para continuar

El proyecto debe seguir una lógica incremental basada en la estructura ya existente:

1. Mantener `src/core` para infraestructura compartida: layout, rutas, utilitarios y componentes globales.
2. Mantener `src/modules` como eje principal de feature/rol: secretario y estudiante.
3. Crear componentes y hooks internos por cada módulo antes de duplicar lógica entre pantallas.
4. Evitar mezclar acceso a datos, validaciones y render dentro de un mismo componente cuando crezca la complejidad.
5. Usar `id` como clave principal en todos los modelos y operaciones de actualización/eliminación.
6. Preparar la API mock para que sea reemplazada por `httpClient` o un servicio real sin tocar la vista.

## 6. Recomendación de migración a backend .NET

Cuando se integre un backend real, el contrato debe definirse primero con la Mesa Técnica. La sustitución no debe cambiar la interfaz, sino solo la implementación de la capa de acceso. Por ejemplo:

```js
export const planesApi = {
  async obtenerPlanes() {
    const response = await httpClient.get('/api/planes');
    return response.data;
  },
};
```

El objetivo es que las pantallas, páginas y hooks sigan funcionando aunque cambie la fuente de datos.

### Contratos sugeridos

- `GET /api/planes`
- `POST /api/planes`
- `PUT /api/planes/{id}`
- `DELETE /api/planes/{id}`
- `GET /api/materias?planId={id}`
- `GET /api/comisiones?materiaId={id}`
- `GET /api/estudiantes/{id}`
- `POST /api/inscripciones`

Se recomienda documentar DTOs, códigos HTTP, errores normalizados, validaciones y autenticación antes de implementar consumo real.

## 7. Convenciones de código del proyecto

### Nombres y organización

- Componentes React: `PascalCase`.
- Archivos JSX: `PascalCase`.
- Hooks: prefijo `use`, por ejemplo `useCrud` o `useEnrollments`.
- Funciones y variables: `camelCase`.
- Constantes globales: `UPPER_SNAKE_CASE` cuando corresponda.
- Identificadores de entidad: `id` y nombres descriptivos como `planId`, `materiaId`, `estudianteId`.

### React y estado

- Mantener el estado inmutable.
- Usar actualizaciones funcionales cuando el siguiente estado dependa del anterior.
- No mutar arrays ni objetos directamente.
- Tratar la lista como fuente de verdad y actualizar desde callbacks del hook o del servicio.
- Manejar estados `loading`, `error` y `empty` en operaciones asíncronas.
- Evitar efectos innecesarios o respuestas pendientes sin limpieza.

### Estilos y presentación

- Los estilos se encuentran en `src/styles/` y deben usarse como base visual compartida.
- La estructura de estilos actual puede continuar evolucionando, pero siempre conviene separar layout, navegación, tablas y módulos específicos.
- No mezclar lógica de negocio con presentación; los componentes deben delegar la lógica a hooks o servicios.

## 8. Continuidad del desarrollo

La continuidad del proyecto debe enfocarse en estos puntos prioritarios:

1. Consolidar la base de rutas y roles con `secretario` y `estudiante`.
2. Completar el dominio de planes, docentes y estudiantes con formularios y validaciones.
3. Reforzar la capa de API mock para que se comporte como un backend real con errores, estados y persistencia en memoria.
4. Crear hooks específicos por entidad para centralizar carga, edición y eliminación.
5. Definir DTOs y contratos con el equipo .NET antes de implementar HTTP real.
6. Ejecutar validaciones finales antes de cada entrega:

```bash
npm run lint
npm test
npm run build
```

## 9. Recomendaciones finales

La base actual del proyecto es viable y estructurada, pero aún requiere mayor definición de dominio y de contratos. La estrategia correcta es continuar desde la arquitectura actual de módulos, no reescribir la solución completa. El proyecto debe evolucionar de forma incremental, manteniendo la separación entre UI, rutas, hooks y acceso a datos, y dejando la capa de backend desacoplada para facilitar la integración con .NET.

Este enfoque preserva la continuidad del proyecto, reduce el riesgo de cambios masivos y permite que cada equipo o integrante trabaje por módulos sin romper el flujo principal del sistema.
