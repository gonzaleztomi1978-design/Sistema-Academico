import { useEffect, useState } from 'react';
import { permissionsService } from '../../services/permissionsService';
import { modulosVisibles } from './permisos';
import { guardarModulos, obtenerSesion } from './session';

// Ids de los módulos que la API le deja ver al usuario, o null mientras no se sepa.
// Arranca con lo guardado en la sesión y lo vuelve a pedir cada vez que se carga la aplicación.
export function usePermisos() {
  const [modulos, setModulos] = useState(() => obtenerSesion()?.modulos ?? null);

  useEffect(() => {
    let vigente = true;

    permissionsService
      .obtenerMisPermisos()
      .then((permisos) => {
        const permitidos = modulosVisibles(permisos);
        guardarModulos(permitidos);
        if (vigente) setModulos(permitidos);
      })
      // Sin respuesta queda lo que había: el menú del rol o lo guardado en la sesión.
      .catch(() => {});

    return () => {
      vigente = false;
    };
  }, []);

  return modulos;
}
