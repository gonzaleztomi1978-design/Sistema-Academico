import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import SimuladorRoles from '../components/SimuladorRoles';
import { secretarioRoutes } from '../../modules/secretario/secretarioRoutes';
import { estudianteRoutes } from '../../modules/estudiante/estudianteRoutes';

function App() {
  const [rolSimulado, setRolSimulado] = useState('secretario');

  const redireccionPorDefecto = (
    <Navigate to={rolSimulado === 'secretario' ? '/secretario/inicio' : '/estudiante/inicio'} replace />
  );

  return (
    <BrowserRouter>
      <SimuladorRoles rolSimulado={rolSimulado} onChange={setRolSimulado} />
      <Routes>
        {secretarioRoutes(rolSimulado)}
        {estudianteRoutes(rolSimulado)}
        <Route path="*" element={redireccionPorDefecto} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
