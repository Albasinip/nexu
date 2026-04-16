'use client'

import Link from 'next/link'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { buyerLoginAction, type BuyerAuthState } from '@/app/actions/buyerAuth'

const initialState: BuyerAuthState = {
  success: false,
  error: '',
}

export default function BuyerLoginPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(buyerLoginAction, initialState)

  useEffect(() => {
    if (state.success) {
      router.push('/user/profile')
      router.refresh()
    }
  }, [state.success, router])

  return (
    <div className="buyer-auth-page">
      <div className="buyer-auth-card">
        <div className="buyer-auth-header">
          <h1>Ingresar</h1>
          <p>Accede a tu cuenta para revisar tus pedidos y datos guardados.</p>
        </div>

        {state.error && (
          <div className="buyer-auth-error-box">
            {state.error}
          </div>
        )}

        <form action={formAction} className="buyer-auth-form">
          <div className="buyer-auth-field">
            <label className="buyer-auth-label">Email</label>
            <input
              name="email"
              type="email"
              required
              className="buyer-auth-input"
              placeholder="tu@email.com"
            />
          </div>

          <div className="buyer-auth-field">
            <label className="buyer-auth-label">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="buyer-auth-input"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="buyer-auth-submit"
          >
            {pending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="buyer-auth-footer">
          <span>¿No tienes cuenta?</span>{' '}
          <Link href="/user/register">Crear cuenta</Link>
        </div>
      </div>
    </div>
  )
}