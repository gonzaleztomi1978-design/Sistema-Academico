import { Navigate } from "react-router-dom";
import { obtenerSesion } from "../api.js";

export default function RutaProtegida({ children }) {
  const sesion = obtenerSesion();
  if (!sesion) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
