'use server'

import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateBusinessProfile(businessId: string, formData: FormData) {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'No autorizado.' }
    }

    // Comprobar que el usuario logueado es el dueño del negocio
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    })

    if (!business || business.ownerId !== user.id) {
      return { success: false, error: 'No tienes permisos para modificar este local.' }
    }

    const description = formData.get('description') as string | null
    const city = formData.get('city') as string | null
    const country = formData.get('country') as string | null

    await prisma.business.update({
      where: { id: businessId },
      data: {
        description: description || null,
        city: city || null,
        country: country || null
      }
    })

    revalidatePath('/dashboard/settings')
    revalidatePath(`/store/${business.slug}`)
    
    return { success: true }
  } catch (error: any) {
    console.error('Error updating business profile:', error)
    return { success: false, error: error.message || 'Error al actualizar el perfil.' }
  }
}
