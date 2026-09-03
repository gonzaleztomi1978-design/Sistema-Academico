import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./paginas/Login.jsx";
import Inicio from "./paginas/Inicio.jsx";
import RutaProtegida from "./componentes/RutaProtegida.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RutaProtegida>
            <Inicio />
          </RutaProtegida>
        }
      />
      {/*
        Equipos 2, 3 y 4: agreguen sus rutas acá, envueltas en <RutaProtegida>.
        Ejemplo:
        <Route path="/inscripciones" element={<RutaProtegida><Inscripciones /></RutaProtegida>} />
      */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
