'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { tenantService } from '@/core/tenant/tenant.service';
import { productsService } from '@/core/products/products.service';
import { productInputSchema } from '@/core/products/products.schema';

export async function createProductAction(formData: FormData) {
  const tenant = await tenantService.getCurrentTenant();
  
  if (!tenant) return redirect('/auth/login?error=Sesión expirada o pérdida de negocio');

  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') ? String(formData.get('category')) : null,
    price: parseFloat(formData.get('price') as string),
    isActive: formData.get('isActive') === 'on',
  };

  const parsed = productInputSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => i.message).join(', ');
    return redirect(`/dashboard/products/new?error=${encodeURIComponent(errorMsg)}`);
  }

  const result = await productsService.createProduct(tenant.business.id, parsed.data);
  if (!result.success) {
    return redirect(`/dashboard/products/new?error=${encodeURIComponent(result.error || 'Error inesperado')}`);
  }

  revalidatePath('/dashboard/products', 'page');
  revalidatePath('/store', 'layout');  // Limpia caché de todo el storefront público
  redirect('/dashboard/products');
}

export async function updateProductAction(productId: string, formData: FormData) {
  const tenant = await tenantService.getCurrentTenant();
  if (!tenant) return redirect('/auth/login?error=Sesión expirada o pérdida de negocio');

  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') ? String(formData.get('category')) : null,
    price: parseFloat(formData.get('price') as string),
    isActive: formData.get('isActive') === 'on',
  };

  const parsed = productInputSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => i.message).join(', ');
    return redirect(`/dashboard/products/${productId}?error=${encodeURIComponent(errorMsg)}`);
  }

  const result = await productsService.updateProduct(tenant.business.id, productId, parsed.data);
  if (!result.success) {
    return redirect(`/dashboard/products/${productId}?error=${encodeURIComponent(result.error || 'Error inesperado')}`);
  }

  revalidatePath('/dashboard/products', 'page');
  revalidatePath('/store', 'layout');
  redirect('/dashboard/products');
}

export async function toggleProductStatusAction(formData: FormData) {
    const tenant = await tenantService.getCurrentTenant();
    if (!tenant) return redirect('/auth/login?error=Sesión expirada');

    const productId = formData.get('productId') as string;
    const currentStatus = formData.get('currentStatus') === 'true';

    await productsService.toggleProductStatus(tenant.business.id, productId, !currentStatus);
    revalidatePath('/dashboard/products', 'page');
    revalidatePath('/store', 'layout');
}

export async function deleteProductAction(formData: FormData) {
    const tenant = await tenantService.getCurrentTenant();
    if (!tenant) return redirect('/auth/login?error=Sesión expirada');

    const productId = formData.get('productId') as string;

    await productsService.deleteProduct(tenant.business.id, productId);
    revalidatePath('/dashboard/products', 'page');
    revalidatePath('/store', 'layout');
}
