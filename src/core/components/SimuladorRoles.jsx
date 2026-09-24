import { useNavigate } from 'react-router-dom';

function SimuladorRoles({ rolSimulado, onChange }) {
  const navigate = useNavigate();

  const cambiarRol = (rol) => {
    onChange(rol);
    navigate(rol === 'secretario' ? '/secretario/inicio' : '/estudiante/inicio');
  };

  return (
    <div className="simulador-roles" role="toolbar" aria-label="Simulador de roles">
      <span>Vista de desarrollo</span>
      <div className="simulador-roles__buttons">
        <button className={rolSimulado === 'secretario' ? 'activo' : ''} type="button" onClick={() => cambiarRol('secretario')}>
          Secretario
        </button>
        <button className={rolSimulado === 'estudiante' ? 'activo' : ''} type="button" onClick={() => cambiarRol('estudiante')}>
          Estudiante
        </button>
      </div>
    </div>
  );
}

export default SimuladorRoles;
