'use client';

import React, { useState } from 'react';
import { useAuthDrawer } from './BuyerAuthContext';
import { buyerLoginAction, buyerRegisterAction, type BuyerAuthState } from '@/app/actions/buyerAuth';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

export function BuyerAuthDrawer() {
  const { isAuthDrawerOpen, closeAuthDrawer } = useAuthDrawer();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const router = useRouter();
  const initialState: BuyerAuthState = { success: false, error: '' };

  const [loginState, loginAction, isLoginPending] = useActionState(buyerLoginAction, initialState);
  const [registerState, registerAction, isRegisterPending] = useActionState(buyerRegisterAction, initialState);

  const state = mode === 'LOGIN' ? loginState : registerState;
  const pending = mode === 'LOGIN' ? isLoginPending : isRegisterPending;
  const formAction = mode === 'LOGIN' ? loginAction : registerAction;

  useEffect(() => {
    if (state.success) {
      closeAuthDrawer();
      router.refresh();
      setTimeout(() => {
        setMode('LOGIN');
      }, 300);
    }
  }, [state.success, closeAuthDrawer, router]);

  if (!isAuthDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={closeAuthDrawer} 
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 9999, backdropFilter: "blur(4px)" }} 
      />
      
      {/* Drawer */}
      <div style={{ position: "fixed", top: 0, right: 0, width: "100%", maxWidth: "450px", height: "100%", background: "var(--color-surface)", zIndex: 10000, boxShadow: "-4px 0 25px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", animation: "slideInRight 0.3s ease-out" }}>
        
        <div style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
          <button onClick={closeAuthDrawer} style={{ background: "var(--color-surface)", border: "none", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", color: "var(--color-text-main)", fontWeight: "bold", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ padding: "0 2.5rem 2.5rem 2.5rem", flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2.5rem", marginTop: "1rem" }}>
            <div style={{ width: "70px", height: "70px", borderRadius: "1rem", background: "var(--color-primary-soft)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 1.5rem auto" }}>
              {mode === 'LOGIN' ? '👋' : '✨'}
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, margin: 0 }}>
              {mode === 'LOGIN' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
              {mode === 'LOGIN' ? 'Ingresa para pedir rápido y sin fricción.' : 'Únete para guardar tu historial y pedir en 1-Click.'}
            </p>
          </div>

          <div style={{ display: "flex", background: "var(--color-surface)", borderRadius: "0.75rem", padding: "0.25rem", marginBottom: "2rem" }}>
            <button 
              type="button"
              onClick={() => { setMode('LOGIN'); }}
              style={{ flex: 1, padding: "0.75rem", borderRadius: "0.5rem", border: "none", background: mode === 'LOGIN' ? "var(--color-surface-hover)" : "transparent", color: mode === 'LOGIN' ? "var(--color-text-main)" : "var(--color-text-muted)", fontWeight: 700, cursor: "pointer", boxShadow: mode === 'LOGIN' ? "0 2px 10px rgba(0,0,0,0.2)" : "none", transition: "all 0.2s" }}
            >
              Ingresar
            </button>
            <button 
              type="button"
              onClick={() => { setMode('REGISTER'); }}
              style={{ flex: 1, padding: "0.75rem", borderRadius: "0.5rem", border: "none", background: mode === 'REGISTER' ? "var(--color-surface-hover)" : "transparent", color: mode === 'REGISTER' ? "var(--color-text-main)" : "var(--color-text-muted)", fontWeight: 700, cursor: "pointer", boxShadow: mode === 'REGISTER' ? "0 2px 10px rgba(0,0,0,0.2)" : "none", transition: "all 0.2s" }}
            >
              Registrarse
            </button>
          </div>

          {state.error && (
            <div style={{ padding: "0.85rem", background: "var(--color-danger-soft)", color: "var(--color-danger)", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.9rem", textAlign: "center", fontWeight: 600 }}>
              {state.error}
            </div>
          )}

          <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {mode === 'REGISTER' && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-muted)", marginLeft: "0.25rem" }}>Nombre completo</label>
                <input required name="name" type="text" placeholder="Ej. Juan Pérez" style={{ padding: "1rem", borderRadius: "0.75rem", border: "2px solid var(--color-surface-dim)", background: "var(--color-surface-dim)", color: "var(--color-text-main)", fontSize: "1rem", outline: "none" }} />
              </div>
            )}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-muted)", marginLeft: "0.25rem" }}>Correo electrónico</label>
              <input required name="email" type="email" placeholder="tu@correo.com" style={{ padding: "1rem", borderRadius: "0.75rem", border: "2px solid var(--color-surface-dim)", background: "var(--color-surface-dim)", color: "var(--color-text-main)", fontSize: "1rem", outline: "none" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-muted)", marginLeft: "0.25rem" }}>Contraseña</label>
              <input required name="password" type="password" placeholder="••••••••" style={{ padding: "1rem", borderRadius: "0.75rem", border: "2px solid var(--color-surface-dim)", background: "var(--color-surface-dim)", color: "var(--color-text-main)", fontSize: "1rem", outline: "none" }} />
            </div>

            <button disabled={pending} type="submit" style={{ marginTop: "1rem", padding: "1.25rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "0.75rem", fontWeight: 800, cursor: pending ? "not-allowed" : "pointer", fontSize: "1.1rem", opacity: pending ? 0.7 : 1, boxShadow: "0 4px 15px rgba(255, 106, 43, 0.3)" }}>
              {pending ? "Procesando..." : (mode === 'LOGIN' ? "Iniciar Sesión" : "Crear Cuenta")}
            </button>
          </form>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </>
  );
}
