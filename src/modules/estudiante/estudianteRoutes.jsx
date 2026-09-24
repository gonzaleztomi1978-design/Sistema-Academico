import { lazy, Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { withSuspense } from '../../core/router/withSuspense';

const HomePageEstudiante = lazy(() => import('./pages/Inicio/HomePage'));
const InscripcionesEstudiante = lazy(() => import('./pages/Inscripciones/InscripcionesEstudiante'));
const AppLayout = lazy(() => import('../../core/layouts/AppLayout'));

export const estudianteRoutes = (rolSimulado) => (
  <Route
    key="estudiante"
    path="/estudiante"
    element={
      rolSimulado === 'estudiante'
        ? withSuspense(AppLayout, { rolSimulado: 'estudiante' })
        : <Navigate to="/secretario/inicio" replace />
    }
  >
    <Route index element={<Navigate to="inicio" replace />} />
    <Route path="inicio" element={withSuspense(HomePageEstudiante)} />
    <Route path="inscripciones" element={withSuspense(InscripcionesEstudiante)} />
  </Route>
);
