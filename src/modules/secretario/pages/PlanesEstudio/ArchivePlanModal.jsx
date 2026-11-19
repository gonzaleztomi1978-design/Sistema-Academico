import { CircleAlert } from 'lucide-react';
import { useSubmit } from '../../../../hooks/useSubmit';
import '../../../../styles/modal.css';

function ArchivePlanModal({ plan, onClose, onConfirm }) {
  const { submit, isSubmitting, submitError } = useSubmit(onConfirm);
  const isArchiving = plan.activo;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="archive-plan-title">
      <div className="modal-content archive-plan-modal">
        <div className="archive-plan-body">
          <CircleAlert
            size={56}
            strokeWidth={2}
            className={`archive-plan-icon ${isArchiving ? '' : 'is-restore'}`}
          />

          <h2 id="archive-plan-title">
            {isArchiving ? '¿Archivar plan de estudio?' : '¿Restaurar plan de estudio?'}
          </h2>

          {isArchiving ? (
            <>
              <p>El plan dejará de aparecer entre los planes activos.</p>
              <p>Podrás restaurarlo más adelante.</p>
            </>
          ) : (
            <>
              <p>El plan volverá a aparecer entre los planes activos.</p>
              <p>Podrás archivarlo nuevamente más adelante.</p>
            </>
          )}

          {submitError && <p className="field-error" role="alert">{submitError}</p>}

          <div className="archive-plan-actions">
            <button type="button" className="modal-cancel-button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button
              type="button"
              className={isArchiving ? 'archive-plan-danger' : 'modal-submit-button'}
              onClick={() => submit()}
              disabled={isSubmitting}
            >
              {isArchiving
                ? (isSubmitting ? 'Archivando...' : 'Archivar plan')
                : (isSubmitting ? 'Restaurando...' : 'Restaurar plan')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchivePlanModal;