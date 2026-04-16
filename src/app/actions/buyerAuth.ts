'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { authService } from '@/core/auth/auth.service'
import { createClient } from '@/utils/supabase/server'

export type BuyerAuthState = {
  success: boolean
  error: string
}

export async function buyerLoginAction(
  prevState: BuyerAuthState,
  formData: FormData
): Promise<BuyerAuthState> {
  const email = formData.get('email')?.toString().trim() || ''
  const password = formData.get('password')?.toString() || ''

  if (!email) {
    return { success: false, error: 'Ingresa tu correo electrónico.' }
  }

  if (!password) {
    return { success: false, error: 'Ingresa tu contraseña.' }
  }

  const result = await authService.login({ email, password })

  if (!result.success) {
    return { success: false, error: result.error || 'Credenciales inválidas.' }
  }

  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.user_metadata?.role === 'SELLER') {
    await supabase.auth.signOut()
    return {
      success: false,
      error: 'Esta cuenta pertenece a un negocio. Usa el portal vendedor.',
    }
  }

  revalidatePath('/', 'layout')
  return { success: true, error: '' }
}

export async function buyerRegisterAction(
  prevState: BuyerAuthState,
  formData: FormData
): Promise<BuyerAuthState> {
  const name = formData.get('name')?.toString().trim() || ''
  const email = formData.get('email')?.toString().trim() || ''
  const password = formData.get('password')?.toString() || ''

  if (!name) {
    return { success: false, error: 'Ingresa tu nombre.' }
  }

  if (!email) {
    return { success: false, error: 'Ingresa tu correo.' }
  }

  if (!password) {
    return { success: false, error: 'Ingresa una contraseña.' }
  }

  const result = await authService.customerSignup({ name, email, password })

  if (!result.success) {
    return { success: false, error: result.error || 'Error al crear cuenta.' }
  }

  revalidatePath('/', 'layout')
  return { success: true, error: '' }
}

export async function buyerLogoutAction(formData?: FormData) {
  await authService.logout()

  const redirectTo = formData?.get('redirectTo')?.toString()

  revalidatePath('/', 'layout')
  redirect(redirectTo || '/store')
}