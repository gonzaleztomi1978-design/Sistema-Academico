import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../api.js";

export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navegar = useNavigate();

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");
    setCargando(true);
    try {
      await iniciarSesion(nombreUsuario, password);
      navegar("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-fondo">
      <form className="login-tarjeta" onSubmit={manejarEnvio}>
        <p className="login-instituto">Instituto Superior Cura Gabriel Brochero</p>
        <h1>Sistema Académico</h1>
        <p className="login-subtitulo">Ingresá con tu usuario institucional</p>

        <label htmlFor="usuario">Usuario</label>
        <input
          id="usuario"
          type="text"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          autoComplete="username"
          required
          autoFocus
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
