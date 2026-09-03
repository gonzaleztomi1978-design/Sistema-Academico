import { useNavigate } from "react-router-dom";
import { obtenerSesion, cerrarSesion } from "../api.js";

// Cada tarjeta representa un módulo del sistema. Cuando un equipo integre su
// módulo, reemplaza "pendiente" por la ruta real (ej: ruta: "/inscripciones").
const modulos = [
  { titulo: "Gestión de usuarios", equipo: "E1 — Acceso", permiso: "usuarios.gestionar", descripcion: "Alta, baja y modificación de usuarios, roles y permisos." },
  { titulo: "Inscripción a 1.º año", equipo: "E2 — Secretaría", permiso: "estudiantes.inscribir_primero", descripcion: "Inscribir estudiantes ingresantes a primer año." },
  { titulo: "Estudiantes por curso", equipo: "E2 — Secretaría", permiso: "estudiantes.ver_por_curso", descripcion: "Ver estudiantes por curso y comisión." },
  { titulo: "Docentes y materias", equipo: "E2 — Secretaría", permiso: "docentes.asignar_materias", descripcion: "Asignar las materias que dicta cada docente." },
  { titulo: "Planes de estudio", equipo: "E3 — Gestión Académica", permiso: "planes.gestionar", descripcion: "ABM de planes de estudio y organización de materias." },
  { titulo: "Correlatividades", equipo: "E3 — Gestión Académica", permiso: "correlatividades.gestionar", descripcion: "Definir requisitos entre materias." },
  { titulo: "Materias disponibles", equipo: "E4 — Inscripciones", permiso: "materias.consultar", descripcion: "Consultar materias habilitadas según correlatividades." },
  { titulo: "Inscribirme a materias", equipo: "E4 — Inscripciones", permiso: "inscripciones.crear", descripcion: "Inscripción a materias de 2.º y 3.º año." },
  { titulo: "Mis inscripciones", equipo: "E4 — Inscripciones", permiso: "inscripciones.consultar", descripcion: "Ver el estado de mis inscripciones." },
];

export default function Inicio() {
  const navegar = useNavigate();
  const sesion = obtenerSesion();
  const { nombreCompleto, rol, permisos } = sesion.usuario;

  const modulosVisibles = modulos.filter((m) => permisos.includes(m.permiso));

  function manejarSalir() {
    cerrarSesion();
    navegar("/login");
  }

  return (
    <div className="inicio">
      <header className="inicio-encabezado">
        <div>
          <p className="inicio-instituto">Instituto Superior Cura Gabriel Brochero</p>
          <h1>Sistema Académico</h1>
        </div>
        <div className="inicio-usuario">
          <span>
            {nombreCompleto} · <strong>{rol}</strong>
          </span>
          <button onClick={manejarSalir}>Cerrar sesión</button>
        </div>
      </header>

      <main className="inicio-contenido">
        <h2>Módulos disponibles para tu rol</h2>
        <div className="tarjetas">
          {modulosVisibles.map((modulo) => (
            <article key={modulo.permiso} className="tarjeta">
              <span className="tarjeta-equipo">{modulo.equipo}</span>
              <h3>{modulo.titulo}</h3>
              <p>{modulo.descripcion}</p>
              <span className="tarjeta-pendiente">Pendiente de integración</span>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
