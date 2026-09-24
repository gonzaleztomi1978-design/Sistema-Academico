import { useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import PlanCard from './PlanCard';
import { plansApi } from '../../components/plans/plansApi';
import { useAsyncResource } from '../../../../hooks/useAsyncResource';

function PlanesEstudio() {
  const { data: planes, setData: setPlanes, isLoading, error } = useAsyncResource(plansApi.obtenerPlanes, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState('');

  const filteredPlans = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return planes;
    return planes.filter((plan) => plan.nombre.toLowerCase().includes(normalizedSearch));
  }, [planes, searchTerm]);

  const createPlan = async () => {
    const newPlan = await plansApi.crearPlan({ nombre: 'Nuevo plan académico', añoInicio: 2026, añoFin: 2029, activo: true });
    setPlanes((currentPlans) => [newPlan, ...currentPlans]);
    setNotice(`Se creó el plan "${newPlan.nombre}".`);
  };

  const editPlan = (planId) => {
    const plan = planes.find((currentPlan) => currentPlan.id === planId);
    if (plan) setNotice(`Editar plan: ${plan.nombre}.`);
  };

  const togglePlanStatus = async (planId) => {
    const plan = planes.find((currentPlan) => currentPlan.id === planId);
    if (!plan) return;
    await plansApi.actualizarPlan(planId, { activo: !plan.activo });
    setPlanes((currentPlans) => currentPlans.map((currentPlan) => (currentPlan.id === planId ? { ...currentPlan, activo: !currentPlan.activo } : currentPlan)));
  };

  const deletePlan = async (planId) => {
    const plan = planes.find((currentPlan) => currentPlan.id === planId);
    await plansApi.eliminarPlan(planId);
    setPlanes((currentPlans) => currentPlans.filter((currentPlan) => currentPlan.id !== planId));
    if (plan) setNotice(`Se eliminó el plan "${plan.nombre}".`);
  };

  const viewSubjects = (planId) => {
    const plan = planes.find((currentPlan) => currentPlan.id === planId);
    if (plan) setNotice(`Materias y correlatividades del plan ${plan.id}: ${plan.nombre}.`);
  };

  return (
    <section className="planes-page">
      <div className="planes-heading">
        <div>
          <span className="planes-eyebrow">GESTIÓN ACADÉMICA</span>
          <h1>Planes de Estudio</h1>
          <p>Administrá la oferta académica y sus correlatividades.</p>
        </div>
      </div>

      <div className="planes-toolbar">
        <label className="planes-search">
          <Search size={18} />
          <input list="planes-autocomplete" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar plan de estudio..." aria-label="Buscar plan de estudio" />
          <datalist id="planes-autocomplete">
            {planes.map((plan) => <option key={plan.id} value={plan.nombre} />)}
          </datalist>
        </label>
        <button className="create-plan-button" type="button" onClick={createPlan}><Plus size={18} /> Crear Nuevo Plan</button>
      </div>

      {notice && <div className="planes-notice" role="status">{notice}<button type="button" aria-label="Cerrar aviso" onClick={() => setNotice('')}><X size={16} /></button></div>}

      {error && <p role="alert">{error}</p>}
      {isLoading ? <p>Cargando planes...</p> : <div className="plans-grid">
        {filteredPlans.map((plan) => <PlanCard key={plan.id} plan={plan} onEdit={editPlan} onToggleStatus={togglePlanStatus} onDelete={deletePlan} onViewSubjects={viewSubjects} />)}
      </div>}

      {filteredPlans.length === 0 && <p className="plans-empty">No se encontraron planes de estudio.</p>}
    </section>
  );
}

export default PlanesEstudio;
