'use server'

import { revalidatePath } from 'next/cache';
import { tenantService } from '@/core/tenant/tenant.service';
import { ordersService } from '@/core/orders/orders.service';

export async function updateOrderStatusAction(orderId: string, newStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED") {
  const tenant = await tenantService.getCurrentTenant();
  
  if (!tenant) {
    return { success: false, error: 'Sesión expirada o pérdida de negocio' };
  }

  const result = await ordersService.updateOrderStatus(tenant.business.id, orderId, newStatus);
  
  if (result.success) {
    revalidatePath('/dashboard/orders');
    return { success: true };
  }
  
  return { success: false, error: result.error };
}
