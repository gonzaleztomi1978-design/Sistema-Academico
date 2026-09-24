import { ChevronRight, ClipboardList, GraduationCap, Grid2X2, Settings, UserRound, Users, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import icgbLogo from '../../assets/icgb-logo.svg';

const ICONS = { Grid2X2, GraduationCap, ClipboardList, Users, UserRound };
const MENU_POR_ROL = {
  secretario: [
    { label: 'Inicio', path: '/secretario/inicio', icon: 'Grid2X2' },
    { label: 'Planes de Estudio', path: '/secretario/planes-de-estudio', icon: 'GraduationCap' },
    { label: 'Inscripciones', path: '/secretario/inscripciones', icon: 'ClipboardList' },
    { label: 'Docentes', path: '/secretario/docentes', icon: 'UserRound' },
  ],
  estudiante: [
    { label: 'Inicio', path: '/estudiante/inicio', icon: 'Grid2X2' },
    { label: 'Inscripción a Materias', path: '/estudiante/inscripciones', icon: 'ClipboardList' },
  ],
};

function Sidebar({ rolSimulado = 'secretario', isOpen, onClose }) {
  const menuItems = MENU_POR_ROL[rolSimulado] ?? MENU_POR_ROL.secretario;
  const esEstudiante = rolSimulado === 'estudiante';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand"><img className="brand-logo" src={icgbLogo} alt="ICGB" /><button className="close" onClick={onClose} type="button"><X size={20} /></button></div>
      <div className="role-label">{esEstudiante ? 'PORTAL DEL ESTUDIANTE' : 'SECRETARÍA ACADÉMICA'}</div>
      <nav>
        {menuItems.map(({ label, path, icon }) => {
          const Icon = ICONS[icon];
          return <NavLink key={path} to={path} end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}><Icon size={19} /><span>{label}</span></NavLink>;
        })}
      </nav>
      <div className="sidebar-bottom"><button className="nav-item" type="button"><Settings size={19} /><span>Configuración</span></button><div className="help-card"><div className="help-icon">?</div><div><strong>¿Necesitás ayuda?</strong><span>Consultá el centro de ayuda</span></div><ChevronRight size={16} /></div></div>
    </aside>
  );
}

export default Sidebar;
