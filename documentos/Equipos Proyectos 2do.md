# Organización del proyecto — Sistema Académico


🟦 E1 — Acceso e Integración
**GONZALEZ	Tomás Lautaro*
**LUQUE HEREDIA	Carlos Martín*
**OLMEDO	Joaquín*
**PALACIOS	Damian*
**PETTA	Franco Maximiliano*

Objetivo: construir la puerta de entrada del sistema, e integrar los desarrollos de los otros equipos en un único sistema funcionando.

Funcionalidades
Login.
    Autenticación.
    Gestión de usuarios.
    Roles.
    Permisos.
Integración
    Integrar los módulos.
    Mantener la versión integrada.
    Resolver conflictos entre componentes.
    Verificar que los módulos se comuniquen correctamente.
Git/GitHub
    Estrategia de ramas.
    Pull Requests.
    Integración a main.
    Resolución de conflictos.
    Control de versiones.
Configuración
    Estructura general.
    Configuración común.
    Variables de entorno.
    Configuración de conexión.
Pruebas de integración



🟩 E2 — Secretaría
**RAMIREZ	Cecilia Belén*
**SCARPONI	Fabrizzio*
**ORDOÑEZ	Alan David*
**CARBAJAL	Matias*

Usuario principal: Secretario.

Objetivo: gestionar las personas y las acciones administrativas iniciales.

Funcionalidades:
Inscripción de estudiantes a 1.º año.
Visualización de estudiantes por Curso-Comisiones
Docentes. Asignación de una o más materias que dicta cada docente.


🟨 E3 — Gestión Académica
**RASI	Sofia Agostina*
**CARO	Lorenzo*
**PETTA	Federico*
**CUEVAS	Thiago Andre*
**OCAMPO PERALTA	Lautaro Benjamín*

Usuario principal: Secretario.

Objetivo: administrar la estructura académica.

Funcionalidades:
Plan de estudios. CRUD de plan de estudio. Organización de materias por plan de estudio
Correlatividades. Definición de requisitos entre materias.
Organización de materias por año.



🟧 E4 — Inscripciones
**HERRERA	Jeremías*
**PESA GIMENEZ	Facundo Agustín*
**COCCIA	Agustín*
**SORIA	Esteban Manuel*
**VELAZQUEZ	Carlos Adrian*

Usuario principal: Estudiante.

Objetivo: gestionar las inscripciones de estudiantes de 2.º y 3.º año.

Funcionalidades:
Consultar materias disponibles. Identificar materias habilitadas. Validar correlatividades.
Inscribirse a materias.
Consultar sus inscripciones.

⚙️ Mesa Técnica
Integrantes: 2 representantes de cada equipo

2 de E1
2 de E2
2 de E3
2 de E4

Total: 8 estudiantes + docente Prácticas Profesionalizantes 1 + Programación 2.

La Mesa Técnica es un espacio transversal de arquitectura y coordinación, no un quinto equipo de desarrollo.

1. Arquitectura de capas

Definir la arquitectura común:

Sistema Académico
│
├── API / Controllers
├── Application / Services
├── Domain / Entities
└── Infrastructure / Data

Todos los equipos trabajan dentro de esta misma arquitectura.

2. Estructura de la solución

Definir:

proyectos;
carpetas;
responsabilidades;
dependencias entre capas;
estructura común.

No habrá una arquitectura diferente por equipo.

3. Modelo de datos

Diseñar el modelo único de base de datos:

entidades;
atributos;
PK;
FK;
relaciones;
restricciones;
estados;
nomenclatura.


Y definir qué equipo es responsable de cada entidad.

4. DER

Construir y mantener el DER general del Sistema Académico.

Esto es especialmente importante para detectar dependencias como:

DOCENTE ←→ MATERIA
ESTUDIANTE ←→ INSCRIPCION
MATERIA ←→ CORRELATIVIDAD

antes de que los estudiantes comiencen a programar.

5. APIs y contratos

Definir:

endpoints;
métodos HTTP;
DTO;
formato de respuestas;
códigos HTTP;
convenciones de nombres.


6. Convenciones de desarrollo

Acordar:

nombres de clases;
métodos;
variables;
tablas;
endpoints;
estructura de carpetas;
manejo de errores.

7. Git/GitHub

Definir:

repositorio;
ramas;
nomenclatura;
commits;
Pull Requests;
revisiones;
integración.

8. Coordinación entre equipos

La Mesa Técnica también debe resolver dependencias.

Por ejemplo: E2 necesita a E3


📌 Síntesis final
Equipo	Responsabilidad
E1 — Acceso	Login + usuarios + roles + permisos + Integración + Git + configuración + pruebas de integración
E2 — Secretaría:	Inscripción 1.º + asignación de materias a docentes
E3 — Secretaría:	plan de estudios + Materias + correlatividades + Cursos
E4 — Estudiantes:   Inscripciones de 2.º/3.º + consulta de materias + validación de correlativas

Mesa Técnica	UML + Arquitectura + capas + BD + DER + APIs + convenciones + coordinación

