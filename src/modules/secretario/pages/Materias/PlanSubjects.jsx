import { plansApi } from '../../components/plans/plansApi';
import { useAsyncResource } from '../../../../hooks/useAsyncResource';

const sortByOrder = (a, b) => Number(a.orden) - Number(b.orden);

function PlanSubjects({ plan, onBack }) {
  const { data: materias, isLoading, error } = useAsyncResource(
    () => plansApi.obtenerMaterias(plan.id),
    [plan.id],
  );

  return (
    <section className="planes-page">
      <div className="planes-heading">
        <div>
          <h1>Materias</h1>
          <p>Visualizá las materias asociadas a un plan de estudio.</p>
        </div>
        <button type="button" className="plan-detalle-button" onClick={onBack}>Volver</button>
      </div>

      <p className="subjects-plan-label">{plan.codigo} - {plan.nombre}</p>

      {error && <p className="field-error" role="alert">{error}</p>}
      {isLoading && <p>Cargando materias...</p>}

      {!isLoading && (
        <div className="subjects-table">
          <div className="subjects-table-row subjects-table-head">
            <span>N.º orden</span>
            <span>Formato</span>
            <span>Materia</span>
            <span>Año</span>
            <span>Régimen</span>
            <span>Hs. cátedra semanales</span>
            <span>Hs. reloj totales</span>
          </div>

          {materias.length === 0 ? (
            <p className="plans-empty">Este plan todavía no tiene materias cargadas.</p>
          ) : (
            [...materias].sort(sortByOrder).map((materia) => (
              <div className="subjects-table-row" key={materia.id}>
                <span>{materia.orden}</span>
                <span>{materia.formato}</span>
                <span>{materia.materia}</span>
                <span>{materia.anio.replace('°', '')}</span>
                <span>{materia.regimen}</span>
                <span>{materia.horasCatedra}</span>
                <span>{materia.horasReloj}</span>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default PlanSubjects;