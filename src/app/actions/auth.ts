'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { authService } from '@/core/auth/auth.service'
import { loginSchema, signupSchema } from '@/core/auth/auth.schema'

/**
 * Login Action - UI Controller
 */
export async function login(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  // 1. Zod Validation
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => i.message).join(', ');
    return redirect(`/auth/login?error=${encodeURIComponent(errorMsg)}`);
  }

  // 2. Service Invocation
  const result = await authService.login(parsed.data);
  if (!result.success) {
    const errorMsg = result.status ? `${result.error} (Status: ${result.status})` : result.error;
    return redirect(`/auth/login?error=${encodeURIComponent(errorMsg)}`);
  }

  // Comprobar rol de Seller
  const { createClient } = await import('@/utils/supabase/server');
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user?.user_metadata?.role === 'BUYER') {
    await supabase.auth.signOut();
    return redirect(`/auth/login?error=${encodeURIComponent("Esta cuenta pertenece a un cliente, no a un vendedor.")}`);
  }

  // 3. UI Update (Success)
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

/**
 * Signup Action - UI Controller
 */
export async function signup(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  // 1. Zod Validation
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => i.message).join(', ');
    return redirect(`/auth/register?error=${encodeURIComponent(errorMsg)}`);
  }

  // 2. Service Invocation
  const result = await authService.signup(parsed.data);
  if (!result.success) {
    const errorMsg = result.status ? `${result.error} (Status: ${result.status})` : result.error;
    return redirect(`/auth/register?error=${encodeURIComponent(errorMsg)}`);
  }

  // 3. Flow control
  if (result.success && result.data.requiresEmailConfirmation) {
    return redirect(`/auth/login?error=${encodeURIComponent("Revisa tu correo electrónico para confirmar la cuenta.")}`);
  }

  // 4. UI Update (Success)
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logout() {
  await authService.logout();
  revalidatePath('/', 'layout');
  redirect('/');
}
