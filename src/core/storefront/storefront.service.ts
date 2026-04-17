import { prisma } from '@/lib/prisma';
import { Business, Product, ServiceResult } from '@/types';

export const storefrontService = {
  /**
   * Obtiene todos los locales disponibles (Marketplace), opcionalmente filtrados por localidad.
   */
  async getAllStores(filters?: { city?: string }): Promise<ServiceResult<Partial<Business>[]>> {
    try {
      const dbBusinesses = await prisma.business.findMany({
        where: {
          city: filters?.city ? { equals: filters.city, mode: 'insensitive' } : undefined
        },
        orderBy: { name: 'asc' }
      });

      return { success: true, data: dbBusinesses as Partial<Business>[] };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error desconocido';
      return { success: false, error: message };
    }
  },

  /**
   * Obtiene la configuración del menú público y el local basándose en el slug visible.
   */
  async getMenuBySlug(slug: string): Promise<ServiceResult<{ business: Business; products: Product[] }>> {
    try {
      const dbBusiness = await prisma.business.findUnique({
        where: { slug },
        include: {
          // Extraemos exclusivamente los productos disponibles al público
          products: {
            where: { isActive: true },
            orderBy: { name: 'asc' }
          }
        }
      });

      if (!dbBusiness) {
        return { success: false, error: 'Local no encontrado o temporalmente cerrado.' };
      }

      // Sanitizar salida para no exponer internal IDs de otras tablas ciegamente
      const business: Business = {
        id: dbBusiness.id,
        slug: dbBusiness.slug,
        name: dbBusiness.name,
        description: dbBusiness.description,
        city: dbBusiness.city,
        country: dbBusiness.country,
        ownerId: dbBusiness.ownerId
      };

      return { success: true, data: { business, products: dbBusiness.products as Product[] } };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error desconocido';
      return { success: false, error: message };
    }
  }
};
