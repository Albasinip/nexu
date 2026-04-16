'use client';

import { useAuthDrawer } from './BuyerAuthContext';

export function StoreLoginButton() {
  const { openAuthDrawer } = useAuthDrawer();

  return (
    <button
      onClick={openAuthDrawer}
      className="store-login-btn"
      title="Iniciar sesión"
    >
      Ingresar
    </button>
  );
}