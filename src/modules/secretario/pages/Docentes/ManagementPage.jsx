import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import ManagementTable from '../../../../core/components/ui/ManagementTable';
import { useCrud } from '../../../../hooks/useCrud';
import { plansApi } from '../../components/plans/plansApi';
import { teachersApi } from '../../components/teachers/teachersApi';
import { GraduationCap, UserRound } from 'lucide-react';

const MANAGEMENT_ICONS = { GraduationCap, UserRound };

function ManagementPage({ management }) {
  const [query, setQuery] = useState('');
  const api = useMemo(() => management.apiKey === 'plans' ? { list: plansApi.obtenerPlanes, create: plansApi.crearPlan, remove: plansApi.eliminarPlan } : { list: teachersApi.obtenerDocentes, create: teachersApi.crearDocente, remove: teachersApi.eliminarDocente }, [management.apiKey]);
  const { rows, notice, setNotice, create, remove, notify, isLoading, error } = useCrud({ api, createPayload: management.createPayload, entityLabel: management.singular });
  const Icon = MANAGEMENT_ICONS[management.icon];
  const handleAction = (action, rowId) => {
    if (action === 'Eliminar') remove(rowId);
    else notify(action);
  };

  const tableRows = rows.map(management.toTableRow);
  return <section className="management-page"><div className="management-heading"><div><span className="management-icon"><Icon size={23} /></span><div><h1>{management.title}</h1><p>Administrá los registros de {management.title.toLowerCase()}.</p></div></div><button className="create-button" type="button" onClick={create}><Plus size={18} />Nuevo {management.singular}</button></div>{notice && <div className="crud-notice">{notice}<button onClick={() => setNotice('')} aria-label="Cerrar" type="button">×</button></div>}{error && <p role="alert">{error}</p>}{isLoading ? <p>Cargando...</p> : <ManagementTable management={management} rows={tableRows} query={query} onQueryChange={setQuery} onAction={handleAction} />}</section>;
}

export default ManagementPage;
