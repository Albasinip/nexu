'use server'

import { checkoutSchema } from '@/core/orders/orders.schema';
import { ordersService } from '@/core/orders/orders.service';
import { storefrontService } from '@/core/storefront/storefront.service';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function submitOrderAction(slug: string, rawData: unknown) {
  // 0. Extraer buyer autologged y asegurar que EXISTA en la BD local de Prisma
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  
  let buyerId: string | undefined = undefined;
  if (user) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (dbUser) {
      buyerId = dbUser.id;
    } else {
      // Sincronización de rescate si el usuario existe en Supabase pero no en Prisma (descarte de dev/migraciones)
      try {
        const rescuedUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || 'Usuario Rescatado',
            role: 'BUYER'
          }
        });
        buyerId = rescuedUser.id;
      } catch {
        buyerId = undefined; // Fallback a guest si falla
      }
    }
  }

  // 1. Validar que la tienda exista
  const store = await storefrontService.getMenuBySlug(slug);
  if (!store.success || !store.data) {
    return { success: false, error: 'Negocio no disponible.' };
  }

  // 2. Parsar contra Zod
  const parsed = checkoutSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map(i => i.message).join(', ');
    return { success: false, error: errorMsg };
  }

  // 3. Procesar del lado ciego contra manipulación (Backend Domain Service)
  const result = await ordersService.processCheckout(store.data.business.id, parsed.data, buyerId);
  
  if (!result.success) {
    return { success: false, error: result.error };
  }

  // Si todo validó correctamente en el negocio, debolvemos la ID para redirect cliente.
  return { success: true, orderId: result.data?.id };
}

export async function getCrossSellSuggestions(businessId: string, currentCategoryNames: string[] = []) {
  try {
    const products = await prisma.product.findMany({
      where: { businessId, isActive: true },
    });
    
    // Palabras clave atractivas para acompañantes (bebidas, postres, extras)
    const addonKeywords = ['bebida', 'dulce', 'postre', 'extra', 'adicional', 'salsa', 'snack', 'papas', 'refresco'];
    
    let scoredProducts = products.map(p => {
       const cat = (p.category || '').toLowerCase();
       const name = p.name.toLowerCase();
       let score = 0;
       
       // Sube la prioridad si califica como un "Acompañante" (Upsell natural)
       if (addonKeywords.some(k => cat.includes(k) || name.includes(k))) {
         score += 15;
       }
       
       // Restamos prioridad fuertemente si comparte la misma categoría que ya está comprando 
       // (Ej: Si lleva Hamburguesa, no le sugieras otra Hamburguesa, sugiero algo distinto)
       if (currentCategoryNames.some(c => c.toLowerCase() === cat)) {
         score -= 20;
       }
       
       // Ruido aleatorio para no aburrir con las mismas sugerencias
       score += Math.random() * 10;
       
       return { product: p, score };
    });

    // Ordenamos por mejor score
    scoredProducts = scoredProducts.sort((a,b) => b.score - a.score);

    return { success: true, data: scoredProducts.map(sp => sp.product).slice(0, 4) };
  } catch {
    return { success: false, data: [] };
  }
}
