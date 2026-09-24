import { AlertCircle, CheckCircle2 } from 'lucide-react';

function MateriaInscripcionCard({ materia, periodoAbierto, onInscribir }) {
  const estadoTexto =
    materia.estado === 'A' ? 'Aprobada' : materia.estado === 'R' ? 'Inscripta' : 'Disponible';

  const deshabilitado = !periodoAbierto || materia.estado === 'R' || !!materia.correlativaBloqueante;

  return (
    <article className="materia-inscripcion-card">
      <div className="materia-inscripcion-header">
        <span className="materia-inscripcion-year">Año {materia.año}</span>
        <span className={`materia-inscripcion-estado ${materia.estado ? 'estado-activo' : ''}`}>
          {materia.estado || 'Sin cursar'}
        </span>
      </div>

      <h3>{materia.nombre}</h3>

      <div className="materia-inscripcion-body">
        <p>
          {materia.correlativaBloqueante ? (
            <>
              <AlertCircle size={15} /> Requiere correlativa: {materia.correlativaBloqueante}
            </>
          ) : (
            <>
              <CheckCircle2 size={15} /> {estadoTexto}
            </>
          )}
        </p>
      </div>

      <button
        type="button"
        className="materia-inscripcion-button"
        disabled={deshabilitado}
        onClick={() => onInscribir(materia.id)}
      >
        {materia.estado === 'R' ? 'Inscripta' : materia.correlativaBloqueante ? 'Bloqueada' : 'Inscribirme'}
      </button>
    </article>
  );
}

export default MateriaInscripcionCard;
