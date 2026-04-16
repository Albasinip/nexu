'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { tenantService } from '@/core/tenant/tenant.service';
import { customersService } from '@/core/customers/customers.service';
import { customerInputSchema } from '@/core/customers/customers.schema';

export async function createCustomerAction(formData: FormData) {
  // 1. Obtener identidad y pertenencia (Business actual)
  const tenant = await tenantService.getCurrentTenant();
  if (!tenant) return redirect('/auth/login?error=Sesión expirada');

  // 2. Extraer datos limitados por Zod
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
  };

  const parsed = customerInputSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => i.message).join(', ');
    return redirect(`/dashboard/customers/new?error=${encodeURIComponent(errorMsg)}`);
  }

  // 3. Pasar al Service puramente de Dominio
  const result = await customersService.createCustomer(tenant.business.id, parsed.data);

  if (!result.success) {
    return redirect(`/dashboard/customers/new?error=${encodeURIComponent(result.error || 'Error inesperado')}`);
  }

  // 4. Actualizar estado
  revalidatePath('/dashboard/customers', 'page');
  redirect('/dashboard/customers');
}
