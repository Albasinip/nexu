"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { buyerRegisterAction, type BuyerAuthState } from "@/app/actions/buyerAuth";

const initialState: BuyerAuthState = {
  success: false,
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.12)",
        background: pending ? "rgba(255,255,255,0.08)" : "#ffffff",
        color: pending ? "rgba(255,255,255,0.55)" : "#050505",
        fontSize: "15px",
        fontWeight: 700,
        cursor: pending ? "not-allowed" : "pointer",
        transition: "all .2s ease",
      }}
    >
      {pending ? "Creando cuenta..." : "Crear cuenta"}
    </button>
  );
}

export default function BuyerRegisterPage() {
  const [state, formAction] = useActionState(
    buyerRegisterAction,
    initialState
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(120,119,198,0.12), transparent 30%), linear-gradient(to bottom, #070707, #050505)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          padding: "32px",
        }}
      >
        <div style={{ marginBottom: "28px", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            NEXU
          </p>

          <h1
            style={{
              margin: "10px 0 8px 0",
              fontSize: "32px",
              lineHeight: 1.05,
              fontWeight: 800,
            }}
          >
            Crear cuenta
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Regístrate para guardar tus datos y seguir tus pedidos.
          </p>
        </div>

        <form
          action={formAction}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="name"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.84)",
              }}
            >
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Tu nombre"
              required
              autoComplete="name"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="email"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.84)",
              }}
            >
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="password"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.84)",
              }}
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
              minLength={6}
              style={inputStyle}
            />
          </div>

          {state?.error ? (
            <div
              style={{
                borderRadius: "14px",
                border: "1px solid rgba(255,80,80,0.20)",
                background: "rgba(255,80,80,0.08)",
                padding: "12px 14px",
                fontSize: "13px",
                color: "#ffb4b4",
              }}
            >
              {state.error}
            </div>
          ) : null}

          {state?.success ? (
            <div
              style={{
                borderRadius: "14px",
                border: "1px solid rgba(90,255,140,0.20)",
                background: "rgba(90,255,140,0.08)",
                padding: "12px 14px",
                fontSize: "13px",
                color: "#b8ffcb",
              }}
            >
              Cuenta creada correctamente.
            </div>
          ) : null}

          <div style={{ marginTop: "6px" }}>
            <SubmitButton />
          </div>
        </form>

        <div
          style={{
            marginTop: "18px",
            textAlign: "center",
            fontSize: "14px",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/user/login"
            style={{
              color: "white",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  outline: "none",
  fontSize: "14px",
}
