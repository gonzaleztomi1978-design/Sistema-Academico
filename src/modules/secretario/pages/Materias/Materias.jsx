import { useState } from 'react';
import { CalendarDays, CalendarRange, Clock, FileText, GraduationCap } from 'lucide-react';
import PlanSubjects from './PlanSubjects';
import { plansApi } from '../../components/plans/plansApi';
import { useAsyncResource } from '../../../../hooks/useAsyncResource';

function PlanSubjectsCard({ plan, onViewSubjects }) {
  const { nombre, codigo, añoInicio, añoFin, duracion, modalidad, cargaHoraria, regimen, activo } = plan;

  return (
    <article className="plan-card">
      <div className="plan-card-top">
        <div className="plan-card-icon"><FileText size={20} /></div>
        <div>
          <span className={`plan-badge ${activo ? 'plan-badge-active' : 'plan-badge-inactive'}`}>
            {activo ? 'Activo' : 'Archivado'}
          </span>
          <h3 className="plan-card-title">{codigo} – {nombre}</h3>
          <p className="plan-card-years">{añoFin ? `${añoInicio} - ${añoFin}` : `Desde ${añoInicio}`}</p>
        </div>
      </div>

      <div className="plan-card-details">
        <div className="plan-card-detail">
          <CalendarDays size={18} />
          <div><span className="detail-label">Duración</span><strong className="detail-value">{duracion ?? '—'}</strong></div>
        </div>
        <div className="plan-card-detail">
          <GraduationCap size={18} />
          <div><span className="detail-label">Modalidad</span><strong className="detail-value">{modalidad ?? '—'}</strong></div>
        </div>
        <div className="plan-card-detail">
          <Clock size={18} />
          <div><span className="detail-label">Carga Horaria</span><strong className="detail-value">{cargaHoraria ?? '—'}</strong></div>
        </div>
        <div className="plan-card-detail">
          <CalendarRange size={18} />
          <div><span className="detail-label">Régimen de cursado</span><strong className="detail-value">{regimen ?? '—'}</strong></div>
        </div>
      </div>

      <div className="plan-card-footer">
        <button type="button" className="plan-outline-button" onClick={() => onViewSubjects(plan)}>Ver materias</button>
      </div>
    </article>
  );
}

function Materias() {
  const { data: planes, isLoading, error } = useAsyncResource(plansApi.obtenerPlanes, []);
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (selectedPlan) {
    return <PlanSubjects plan={selectedPlan} onBack={() => setSelectedPlan(null)} />;
  }

  return (
    <section className="planes-page">
      <div className="planes-heading">
        <div>
          <h1>Materias</h1>
          <p>Visualizá las materias asociadas a un plan de estudio.</p>
        </div>
      </div>

      {error && <p role="alert">{error}</p>}
      {isLoading && <p>Cargando planes...</p>}

      {!isLoading && (
        <div className="plans-section">
          <div className="plans-grid">
            {planes.map((plan) => (
              <PlanSubjectsCard key={plan.id} plan={plan} onViewSubjects={setSelectedPlan} />
            ))}
          </div>
          {planes.length === 0 && <p className="plans-empty">Todavía no hay planes de estudio.</p>}
        </div>
      )}
    </section>
  );
}

export default Materias;