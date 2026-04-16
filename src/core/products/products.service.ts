import { prisma } from '@/lib/prisma';
import { Product, ServiceResult } from '@/types';
import { ProductInputDTO } from './products.schema';

// ============================================================================
// HELPERS INTERNOS
// Fuera del objeto service para encapsular lógica y evitar el uso frágil de "this"
// ============================================================================

/**
 * Normaliza cualquier error atrapado (unknown) a un string seguro.
 * Solo emite mensajes genéricos al frontend para no filtrar DB leaks.
 */
function getErrorMessage(error: unknown, fallbackMessage: string = 'Ocurrió un error inesperado.'): string {
  if (error instanceof Error) {
    if (error.message.includes('NOT_FOUND')) return 'Producto inexistente o le pertenece a otro negocio.';
    if (error.message.includes('INVALID_ID')) return 'Credenciales de acceso o identificación están corruptas.';
    
    console.error(`[ProductsService]`, error);
    return fallbackMessage;
  }
  return fallbackMessage;
}

/**
 * Helpers tipados para retornar estructuras ServiceResult predecibles.
 */
function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

function fail<T>(message: string): ServiceResult<T> {
  return { success: false, error: message };
}

/**
 * Validador rápido y seguro de strings / IDs.
 */
function isValidId(id: string | undefined | null): boolean {
  return typeof id === 'string' && id.trim().length > 0;
}

/**
 * Centraliza validación Multi-Tenant (Anti-IDOR).
 * Busca y retorna la data ASEGURÁNDOSE de que pertenezca al businessId inyectado.
 */
async function findTenantProduct(businessId: string, productId: string) {
  if (!isValidId(businessId) || !isValidId(productId)) {
    throw new Error('INVALID_ID');
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, businessId }
  });

  if (!product) {
    throw new Error('NOT_FOUND');
  }

  return product;
}

// ============================================================================
// SERVICIO PRINCIPAL (Data Access Layer - Multi tenant blindada)
// ============================================================================

export const productsService = {
  
  /**
   * Obtiene todos los productos de un local.
   * Listo para escalar (filtros, paginación, etc).
   */
  async listProducts(businessId: string): Promise<ServiceResult<Product[]>> {
    try {
      if (!isValidId(businessId)) throw new Error('INVALID_ID');
      
      const data = await prisma.product.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' }
      });
      
      return ok(data);
    } catch (error) {
      return fail(getErrorMessage(error, 'Error crítico al listar los productos del negocio.'));
    }
  },

  /**
   * Crea un nuevo producto y lo asocia forzosamente al tenant activo.
   */
  async createProduct(businessId: string, data: ProductInputDTO): Promise<ServiceResult<Product>> {
    try {
      if (!isValidId(businessId)) throw new Error('INVALID_ID');
      
      const newProduct = await prisma.product.create({
        data: {
          ...data,
          businessId,
        }
      });
      
      return ok(newProduct);
    } catch (error) {
      return fail(getErrorMessage(error, 'Hubo un problema al crear el producto en la base de datos.'));
    }
  },

  /**
   * Obtiene un producto validando su propiedad strict.
   */
  async getProduct(businessId: string, productId: string): Promise<ServiceResult<Product | null>> {
    try {
      const product = await findTenantProduct(businessId, productId);
      return ok(product);
    } catch (error: any) {
      if (error.message === 'NOT_FOUND') return ok(null); // Esperado explícitamente si se consulta
      return fail(getErrorMessage(error, 'Error al obtener los detalles del producto.'));
    }
  },

  /**
   * Actualización parcial con verificación IDOR nativa.
   * No requiere todo el DTO, solo los campos a tocar (Partial).
   */
  async updateProduct(businessId: string, productId: string, data: Partial<ProductInputDTO>): Promise<ServiceResult<Product>> {
    try {
      await findTenantProduct(businessId, productId); // Válida y frena IDOR preventivamente
      
      const updated = await prisma.product.update({
        where: { id: productId },
        data
      });
      
      return ok(updated);
    } catch (error) {
      return fail(getErrorMessage(error, 'Fallo la actualización de este producto.'));
    }
  },

  /**
   * Cambia el estado público activo/inactivo (Safe Toggling).
   */
  async toggleProductStatus(businessId: string, productId: string, newStatus: boolean): Promise<ServiceResult<Product>> {
    try {
      await findTenantProduct(businessId, productId); // Validación Anti-IDOR
      
      const updated = await prisma.product.update({
        where: { id: productId },
        data: { isActive: newStatus }
      });
      
      return ok(updated);
    } catch (error) {
      return fail(getErrorMessage(error, 'No pudimos cambiar el estado del producto.'));
    }
  },

  /**
   * Borra un producto certificando que pertenece al negocio consultante.
   */
  async deleteProduct(businessId: string, productId: string): Promise<ServiceResult<null>> {
    try {
      await findTenantProduct(businessId, productId); 
      
      // Ya validamos la propiedad en el query previo, update seguro:
      await prisma.product.delete({
        where: { id: productId }
      });
      
      return ok(null);
    } catch (error) {
      return fail(getErrorMessage(error, 'Ocurrió un error irreversible al eliminar este producto.'));
    }
  }
};
