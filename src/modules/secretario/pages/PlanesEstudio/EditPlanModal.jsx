import { useState } from 'react';
import { FileText, X } from 'lucide-react';
import '../../../../styles/modal.css';

const NEGATIVE_NUMBER = /-\s*\d/;
const NEGATIVE_ERROR = 'No se admiten números negativos';

// Evita escribir "-", "+" o "e" en los campos numéricos
const blockInvalidKeys = (event) => {
  if (['-', '+', 'e', 'E'].includes(event.key)) event.preventDefault();
};

function EditPlanModal({ plan, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: plan.nombre ?? '',
    codigo: plan.codigo ?? '',
    añoInicio: plan.añoInicio ?? '',
    añoFin: plan.añoFin ?? '',
    duracion: plan.duracion ?? '',
    modalidad: plan.modalidad ?? '',
    cargaHoraria: plan.cargaHoraria ?? '',
    regimen: plan.regimen ?? '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setForm((currentForm) => ({ ...currentForm, [field]: event.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!String(form.nombre).trim()) newErrors.nombre = 'Este campo es obligatorio';
    if (!String(form.codigo).trim()) newErrors.codigo = 'Este campo es obligatorio';

    if (!form.añoInicio) {
      newErrors.añoInicio = 'Este campo es obligatorio';
    } else if (Number(form.añoInicio) < 0) {
      newErrors.añoInicio = NEGATIVE_ERROR;
    } else if (Number(form.añoInicio) === 0) {
      newErrors.añoInicio = 'Ingresá un año válido';
    }

    if (form.añoFin) {
      if (Number(form.añoFin) < 0) {
        newErrors.añoFin = NEGATIVE_ERROR;
      } else if (!form.añoInicio) {
        newErrors.añoFin = 'Completá primero el año de inicio';
      } else if (Number(form.añoFin) - Number(form.añoInicio) < 3) {
        newErrors.añoFin = 'Debe ser al menos 3 años posterior al año de inicio';
      }
    }

    if (!String(form.duracion).trim()) {
      newErrors.duracion = 'Este campo es obligatorio';
    } else if (NEGATIVE_NUMBER.test(form.duracion)) {
      newErrors.duracion = NEGATIVE_ERROR;
    }

    if (!form.modalidad) newErrors.modalidad = 'Este campo es obligatorio';

    if (!String(form.cargaHoraria).trim()) {
      newErrors.cargaHoraria = 'Este campo es obligatorio';
    } else if (NEGATIVE_NUMBER.test(form.cargaHoraria)) {
      newErrors.cargaHoraria = NEGATIVE_ERROR;
    }

    if (!form.regimen) newErrors.regimen = 'Este campo es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSave({
      nombre: String(form.nombre).trim(),
      codigo: String(form.codigo).trim(),
      añoInicio: Number(form.añoInicio),
      añoFin: form.añoFin ? Number(form.añoFin) : null,
      duracion: String(form.duracion).trim(),
      modalidad: form.modalidad,
      cargaHoraria: String(form.cargaHoraria).trim(),
      regimen: form.regimen,
    });
  };

  const errorClass = (field) => (errors[field] ? 'input-error' : '');

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-plan-title">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-header-title">
            <FileText size={20} />
            <div>
              <h2 id="edit-plan-title">Editar plan de estudio</h2>
              <p>Modificá la información general del plan de estudio.</p>
            </div>
          </div>
          <button type="button" aria-label="Cerrar" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>Información básica</h3>
          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="edit-plan-nombre">Nombre del plan *</label>
              <input id="edit-plan-nombre" type="text" value={form.nombre} onChange={handleChange('nombre')} className={errorClass('nombre')} />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>
            <div className="modal-field">
              <label htmlFor="edit-plan-codigo">Código *</label>
              <input id="edit-plan-codigo" type="text" value={form.codigo} onChange={handleChange('codigo')} className={errorClass('codigo')} />
              {errors.codigo && <span className="field-error">{errors.codigo}</span>}
            </div>
          </div>

          <h3>Información académica</h3>
          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="edit-plan-inicio">Año inicio *</label>
              <input id="edit-plan-inicio" type="number" min="1" value={form.añoInicio} onChange={handleChange('añoInicio')} onKeyDown={blockInvalidKeys} className={errorClass('añoInicio')} />
              {errors.añoInicio && <span className="field-error">{errors.añoInicio}</span>}
            </div>
            <div className="modal-field">
              <label htmlFor="edit-plan-fin">Año finalización</label>
              <input id="edit-plan-fin" type="number" min="1" value={form.añoFin} onChange={handleChange('añoFin')} onKeyDown={blockInvalidKeys} className={errorClass('añoFin')} />
              {errors.añoFin && <span className="field-error">{errors.añoFin}</span>}
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="edit-plan-duracion">Duración de la carrera *</label>
              <input id="edit-plan-duracion" type="text" value={form.duracion} onChange={handleChange('duracion')} className={errorClass('duracion')} />
              {errors.duracion && <span className="field-error">{errors.duracion}</span>}
            </div>
            <div className="modal-field">
              <label htmlFor="edit-plan-modalidad">Modalidad de cursada *</label>
              <select id="edit-plan-modalidad" value={form.modalidad} onChange={handleChange('modalidad')} className={errorClass('modalidad')}>
                <option value="" />
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Mixta">Mixta</option>
              </select>
              {errors.modalidad && <span className="field-error">{errors.modalidad}</span>}
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="edit-plan-carga">Carga horaria *</label>
              <input id="edit-plan-carga" type="text" value={form.cargaHoraria} onChange={handleChange('cargaHoraria')} className={errorClass('cargaHoraria')} />
              {errors.cargaHoraria && <span className="field-error">{errors.cargaHoraria}</span>}
            </div>
            <div className="modal-field">
              <label htmlFor="edit-plan-regimen">Régimen de la carrera *</label>
              <select id="edit-plan-regimen" value={form.regimen} onChange={handleChange('regimen')} className={errorClass('regimen')}>
                <option value="" />
                <option value="Anual">Anual</option>
                <option value="Cuatrimestral">Cuatrimestral</option>
                <option value="Anual / Cuatrimestral">Anual / Cuatrimestral</option>
              </select>
              {errors.regimen && <span className="field-error">{errors.regimen}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-cancel-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="modal-submit-button">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPlanModal;