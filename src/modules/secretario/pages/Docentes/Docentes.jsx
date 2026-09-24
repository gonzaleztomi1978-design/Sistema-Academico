import ManagementPage from './ManagementPage';
import { MANAGEMENT_DATA } from '../../../../data/managementData';

function Docentes() {
  return <ManagementPage management={MANAGEMENT_DATA.teachers} />;
}

export default Docentes;
