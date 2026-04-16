import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { Business, User } from '@/types';

export const tenantService = {
  /**
   * Obtiene el Tenant (Business) actual y valida el contexto integralmente.
   * Extensible a validaciones por sudominio o roles jerárquicos internos (Seller vs Staff).
   */
  async getCurrentTenant(): Promise<{ user: User, business: Business } | null> {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user: supaUser }, error } = await supabase.auth.getUser();
    
    if (error || !supaUser) return null;

    // Buscamos usuario y primera relación de negocio.
    // Preparado para buscar por "business_id" si lo pasamos por param o headers post-arquitectura.
    let userDb = await prisma.user.findUnique({
      where: { id: supaUser.id },
      include: {
        businesses: { take: 1, orderBy: { createdAt: 'asc' } }
      }
    });

    if (!userDb) {
      console.log(`[TENANT_SERVICE] Auto-sincronizando usuario faltante en Prisma (ID: ${supaUser.id})`);
      userDb = await prisma.user.create({
        data: {
          id: supaUser.id,
          email: supaUser.email || `${supaUser.id}@unknown.local`,
          name: supaUser.user_metadata?.name || 'Vendedor',
          role: 'SELLER'
        },
        include: { businesses: true }
      });
    }

    if (userDb.businesses.length === 0 && userDb.role === 'SELLER') {
      console.log(`[TENANT_SERVICE] Auto-creando Business...`);
      const slugSuffix = Date.now().toString(36) + Math.floor(Math.random() * 1000).toString();
      const baseSlug = "store-" + userDb.id.substring(0, 6) + "-" + slugSuffix;
      const newBusiness = await prisma.business.create({
        data: {
          name: `${userDb.name || 'Mi'} Store`,
          slug: baseSlug,
          ownerId: userDb.id
        }
      });
      userDb.businesses = [newBusiness];
    }

    if (!userDb || userDb.businesses.length === 0) return null;

    const currentBusiness = userDb.businesses[0];

    return { 
      user: {
        id: userDb.id,
        email: userDb.email,
        name: userDb.name,
        role: userDb.role,
        createdAt: userDb.createdAt,
      },
      business: {
        id: currentBusiness.id,
        slug: currentBusiness.slug,
        name: currentBusiness.name,
        description: currentBusiness.description,
        ownerId: currentBusiness.ownerId,
      } 
    };
  },

  /**
   * Helper obligatorio para uso en Server Actions y Page Loads de Vendedor.
   */
  async requireCurrentTenant(): Promise<{ user: User, business: Business }> {
    const context = await this.getCurrentTenant();
    if (!context) {
      throw new Error("UNAUTHORIZED_TENANT: No se encontró acceso a un contexto de negocio.");
    }
    return context;
  }
};
