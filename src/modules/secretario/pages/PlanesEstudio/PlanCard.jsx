import { Pencil, Power, Trash2 } from 'lucide-react';

/**
 * Tarjeta reutilizable para un plan de estudio.
 * @param {{ id: number, nombre: string, añoInicio: number, añoFin: number, activo: boolean }} plan
 */
function PlanCard({ plan, onEdit, onToggleStatus, onDelete, onViewSubjects }) {
  const { id, nombre, añoInicio, añoFin, activo } = plan;

  return (
    <article className="plan-card">
      <div className="plan-card-header">
        <span className={`plan-badge ${activo ? 'plan-badge-active' : 'plan-badge-inactive'}`}>
          {activo ? 'Activo' : 'Inactivo'}
        </span>
        <div className="plan-card-actions">
          <button type="button" title="Editar plan" aria-label={`Editar ${nombre}`} onClick={() => onEdit(id)}>
            <Pencil size={16} />
          </button>
          <button type="button" title={activo ? 'Desactivar plan' : 'Activar plan'} aria-label={`${activo ? 'Desactivar' : 'Activar'} ${nombre}`} onClick={() => onToggleStatus(id)}>
            <Power size={17} />
          </button>
          <button className="plan-delete-action" type="button" title="Eliminar plan" aria-label={`Eliminar ${nombre}`} onClick={() => onDelete(id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="plan-card-body">
        <span className="plan-card-id">PLAN {String(id).padStart(2, '0')}</span>
        <h2>{nombre}</h2>
        <p>Vigencia académica</p>
        <strong>{añoInicio} - {añoFin}</strong>
      </div>
      <button className="plan-subjects-button" type="button" onClick={() => onViewSubjects(id)}>
        Ver Materias y Correlatividades
      </button>
    </article>
  );
}

export default PlanCard;
