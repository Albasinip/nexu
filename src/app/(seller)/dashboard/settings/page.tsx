import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/seller/SettingsForm'

export const metadata = {
  title: 'Configuraciones | Hub Vendedor'
}

export default async function SettingsPage() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  const business = await prisma.business.findFirst({
    where: { ownerId: user.id }
  })

  if (!business) {
    redirect('/dashboard')
  }

  return (
    <div className="page-shell">
      <SettingsForm 
        business={{
          id: business.id,
          name: business.name,
          slug: business.slug,
          description: business.description,
          city: business.city,
          country: business.country
        }} 
      />
    </div>
  )
}

