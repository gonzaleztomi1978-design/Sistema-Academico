import { CircleAlert } from 'lucide-react';
import { useSubmit } from '../../../../hooks/useSubmit';
import '../../../../styles/modal.css';

function DeleteSubjectModal({ onClose, onConfirm }) {
  const { submit, isSubmitting, submitError } = useSubmit(onConfirm);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-subject-title">
      <div className="modal-content archive-plan-modal">
        <div className="archive-plan-body">
          <CircleAlert size={56} strokeWidth={2} className="archive-plan-icon" />
          <h2 id="delete-subject-title">¿Eliminar materia?</h2>
          <p>Esta materia se eliminará del plan de estudio.</p>
          <p>Esta acción no se puede deshacer.</p>

          {submitError && <p className="field-error" role="alert">{submitError}</p>}

          <div className="archive-plan-actions">
            <button type="button" className="modal-cancel-button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="button" className="archive-plan-danger" onClick={() => submit()} disabled={isSubmitting}>
              {isSubmitting ? 'Eliminando...' : 'Eliminar materia'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteSubjectModal;