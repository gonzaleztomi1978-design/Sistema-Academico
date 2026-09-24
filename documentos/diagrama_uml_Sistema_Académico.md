classDiagram

class Director {
    - int id_director
    - string titulosJSON
    + Get()
    + Set()
    + CrearDocente()
    + ObtenerDocente()
    + ActualizarDocente()
    + EliminarDocente()
}

class SecretarioAcademico {
    - int id_secretarioAcademico
    - string titulosJSON
    + Get()
    + Set()
    + ConocerDocente()
    + ConocerAlumno()
    + ConocerReconocimiento()
}

class Usuario {
    - int id_usuario
    - string nombre
    - string apellido
    - int cuil
    - date fechaNacimiento
    - string direccion
    - int id_rol: Rol
    - string email
    - int telefono
    - int contactoEmergencia
    - string passwordHash
    - bool estadoUsuario
    + Get()
    + Set()
    + IniciarSesion()
    + CerrarSesion()
    + CambiarContrasena()
    + VisualizarPerfil()
    + EditarPerfil()
    + ConocerRol()
}

class Rol {
    - int id_rol
    - string nombre
    + Get()
    + Set()
    + CrearRol()
    + ObtenerRol()
    + ActualizarRol()
}

class Docente {
    - int id_docente
    - string titulosJSON
    - bool director_suplente
    + Get()
    + Set()
}

class Docente_Materia {
    - int id_docente_materia
    - Materia materia
    - Docente docente
    - string comision
    + Get()
    + Set()
    + AsignarDocente()
    + RemoverDocente()
    + ConocerMateria()
    + ConocerDocente()
}

class Alumno {
    - int id_alumno
    - int id_usuario
    - string nombre
    - string apellido
    - string dni
    - string legajo
    + Get()
    + Set()
}

class Alumno_Materia {
    - int id_alumno_materia
    - Materia materia
    - Alumno alumno
    - string comision
    + Get()
    + Set()
    + InscribirAlumno()
    + DarDeBajaAlumno()
    + ConocerMateria()
    + ConocerAlumno()
}

class Examen {
    - int id_examen
    - Materia materia
    - Docente docente
    - DateTime fecha
    - tipo_Examen tipo_Examen
    + Get()
    + Set()
    + ProgramarExamen()
    + ModificarExamen()
    + CancelarExamen()
    + ConocerMateria()
    + ConocerDocente()
}

class Materia {
    - int id_materia
    - string nombre
    - string carrera
    - string curso
    + Get()
    + Set()
    + CrearMateria()
    + ObtenerMateria()
    + ActualizarMateria()
    + EliminarMateria()
}

class Programa_Materia {
    - int id_programa
    - Contenido contenido
    - Docente docente
    - Materia materia
    - int ciclo_lectivo
    - string objetivos_especificos
    - string objetivos_generales
    - string horas_semanales
    - string horas_cuatrimestrales
    - string evaluacion
    - string criterios_evaluacion
    - string estrategias_metodologicas
    - string estrategias_acomp_virtual_rem
    - string cond_regular
    - string cond_prom
    - string cond_libre
    - string examenes_virtuales
    - string formato_curricular
    - string condicion
    + Get()
    + Set()
    + CargarPrograma()
    + ObtenerPrograma()
    + ActualizarPrograma()
    + ConocerContenido()
    + ConocerDocente()
    + ConocerMateria()
}

class Contenido {
    - int id_contenido
    - int unidad
    - string titulo_unidad
    - string contenido
    - string bibliografia_obligatoria
    - string bibliografia_complementaria
    + Get()
    + Set()
    + CargarContenido()
    + ActualizarContenido()
}

class Legajo {
    - int idLegajo
    - Tipo_Documento tipo_Documento
    - string ruta_archivo
    - DateTime fecha_carga
    - DateTime fecha_vencimiento
    - string estado
    - bool presentado_fisico
    - string comentario
    + Get()
    + Set()
    + SubirDocumento()
    + AuditarDocumento()
    + ConocerTipo_Documento()
}

class Justificativo {
    - int id_justificativo
    - Usuario usuario
    - Usuario usuario_Auditor
    - string tipo_inasistencia
    - string ruta_archivo
    - string nota_adicional
    - DateTime fecha_carga
    - string estado
    + Get()
    + Set()
    + SubirJustificativo()
    + AuditarJustificativo()
    + ConocerUsuario()
}

class Tipo_Documento {
    - int id_tipo_doc
    - string nombre_documento
    + Get()
    + Set()
    + CrearTipo()
    + ObtenerTipo()
}

class Roles_Tipos_Documentos {
    - int id_roles_tipos_documentos
    - Rol rol
    - Tipo_Documento tipo_doc
    - bool obligatorio
    - bool anual
    + Get()
    + Set()
    + ConfigurarReglaDocumental()
    + ConocerTipo_Documento()
}

class PlanEstudio {
    - int id
    - string nombre
    - int añoInicio
    - int añoFin
    - bool estado
    + Get()
    + Set()
}

class PlanMateria {
    - int id
    - int año
    - int cuatrimestre
    + Get()
    + Set()
}

class Correlatividad {
    - int id
    - int planEstudioId
    - int materiaId
    - int correlativaId
    + Get()
    + Set()
}

class InstanciaParcial {
    - int id_instancia
    - PlanMateria planMateria
    - string tipo_instancia
    - int numero
    - InstanciaParcial instancia_recuperada
    - DateTime fecha
    + Get()
    + Set()
    + ProgramarInstancia()
    + ModificarInstancia()
    + CancelarInstancia()
    + ConocerPlanMateria()
}

class NotaParcial {
    - int id_nota
    - Alumno_Materia alumno_materia
    - InstanciaParcial instancia
    - float valor
    - DateTime fecha_carga
    - Docente docente_carga
    + Get()
    + Set()
    + CargarNota()
    + ModificarNota()
    + ConocerAlumno()
    + ConocerInstancia()
}

class RegistroCursada {
    - int id_registro
    - Alumno_Materia alumno_materia
    - float porcentaje_asistencia
    - float calificacion_numero
    - string calificacion_letra
    - string condicion_final
    - string observaciones
    - DateTime fecha_actualizacion
    + Get()
    + Set()
    + CalcularCondicionFinal()
    + ActualizarAsistencia()
    + ConocerAlumnoMateria()
    + ConocerNotasParciales()
}


Director --> Usuario
SecretarioAcademico --> Usuario
Docente --> Usuario
Alumno --> Usuario

Usuario --> Rol

Docente_Materia --> Docente
Docente_Materia --> Materia

Alumno_Materia --> Alumno
Alumno_Materia --> Materia

Examen --> Materia
Examen --> Docente

Programa_Materia --> Contenido
Programa_Materia --> Docente
Programa_Materia --> Materia

Contenido --|> Programa_Materia

Legajo --> Tipo_Documento
Roles_Tipos_Documentos --> Rol
Roles_Tipos_Documentos --> Tipo_Documento

Usuario --> Justificativo
Usuario --> Legajo

Materia --> Programa_Materia
Materia --> Examen
Materia --> Alumno_Materia
Materia --> Docente_Materia

PlanEstudio --> PlanMateria
PlanMateria --> Materia

Correlatividad --> PlanEstudio
Correlatividad --> "materia" Materia : materiaId
Correlatividad --> "correlativa" Materia : correlativaId

InstanciaParcial --> PlanMateria
InstanciaParcial --> InstanciaParcial : instancia_recuperada

NotaParcial --> InstanciaParcial
NotaParcial --> Alumno_Materia
NotaParcial --> Docente : docente_carga

RegistroCursada --> Alumno_Materia
RegistroCursada --> NotaParcial