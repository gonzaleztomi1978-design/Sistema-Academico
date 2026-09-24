Instituto Superior Cura Gabriel Brochero  
Sistema Académico.   


* Usuarios: Secretario \- Estudiantes
* Login.
    Autenticación.
    Gestión de usuarios. Roles. Permisos.
                    LOGIN
                      │
              AUTENTICACIÓN
                      │
             ┌────────┴────────┐
             │                 │
          USUARIO             ROL
             │                 │
             └────────┬────────┘
                      │
                  PERMISOS
                      │
              ┌────────┴────────┐
              │                 │
           SECRETARIO       ESTUDIANTES
 
* Secretario:  
  * Inscripción de estudiantes a 1.º año.
  * Visualización de estudiantes por Curso-Comisiones
  * Docentes. Asignación de una o más materias que dicta cada docente.
  * Plan de estudios. CRUD de plan de estudio. Organización de materias por plan de estudio
  * Correlatividades. Definición de requisitos entre materias.
  * Organización de materias por año.
* Estudiantes:  
  * Consultar materias disponibles. Identificar materias habilitadas. Validar correlatividades.
  * Inscribirse a materias.
  * Consultar sus inscripciones.

