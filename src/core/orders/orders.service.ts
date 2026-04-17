import { prisma } from "@/lib/prisma";
import { ServiceResult, Order, OrderWithDetails } from "@/types";
import { CheckoutDTO } from "./orders.schema";

/**
 * ==============================
 * Helpers
 * ==============================
 */

function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

function fail<T = never>(error: string): ServiceResult<T> {
  return { success: false, error };
}

function getErrorMessage(error: unknown, defaultMessage: string = "Error interno del servidor"): string {
  if (error instanceof Error) return error.message;
  return defaultMessage;
}

function isValidId(value: string): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * ==============================
 * Orders Service
 * ==============================
 */

export const ordersService = {
  /**
   * Procesa una compra validando que:
   * - los productos pertenezcan al tenant
   * - estén activos
   * - el total final se calcule exclusivamente en servidor
   */
  async processCheckout(
    businessId: string,
    data: CheckoutDTO,
    buyerId?: string
  ): Promise<ServiceResult<Order>> {
    if (!isValidId(businessId)) {
      return fail("SECURITY_ERROR: businessId inválido");
    }

    try {
      /**
       * 1. Obtener ids de productos del carrito
       */
      const productIds = data.items.map((item) => item.id);

      /**
       * 2. Consultar productos reales del negocio
       */
      const dbProducts = await prisma.product.findMany({
        where: {
          businessId,
          id: { in: productIds },
          isActive: true,
        },
      });

      /**
       * 3. Validar que todos los ítems existan, pertenezcan al local
       *    y sigan activos
       */
      if (dbProducts.length !== productIds.length) {
        return fail(
          "SECURITY_ERROR: Algunos artículos del carrito ya no están disponibles en este local."
        );
      }

      /**
       * 4. Calcular total en servidor y construir snapshot de items
       */
      let totalAmount = 0;

      const orderItems = data.items.map((cartItem) => {
        const product = dbProducts.find((dbProduct) => dbProduct.id === cartItem.id);

        if (!product) {
          throw new Error("Producto inválido en el carrito");
        }

        totalAmount += product.price * cartItem.quantity;

        return {
          productId: product.id,
          quantity: cartItem.quantity,
          priceAtTime: product.price,
        };
      });

      /**
       * 5. Crear orden transaccional
       */
      const createdOrder = await prisma.order.create({
        data: {
          businessId,
          buyerId: buyerId ?? null,
          totalAmount,
          status: "PENDING",
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          address: data.address ?? null,
          notes: data.notes ?? null,
          items: {
            create: orderItems,
          },
        },
      });

      return ok(createdOrder as Order);
    } catch (error) {
      return fail(getErrorMessage(error));
    }
  },

  /**
   * Obtiene todos los pedidos de un local, ordenados del más reciente al más antiguo.
   */
  async getBusinessOrders(businessId: string): Promise<ServiceResult<OrderWithDetails[]>> {
    if (!isValidId(businessId)) return fail("SECURITY_ERROR: businessId inválido");

    try {
      const dbOrders = await prisma.order.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true }
          },
          buyer: { select: { name: true, email: true } }
        }
      });
      return ok(dbOrders as unknown as OrderWithDetails[]);
    } catch (error) {
      return fail(getErrorMessage(error));
    }
  },

  /**
   * Modifica el estado de un pedido garantizando que pertenezca al local del Seller activo (IDOR protection).
   */
  async updateOrderStatus(businessId: string, orderId: string, newStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"): Promise<ServiceResult<boolean>> {
    if (!isValidId(businessId) || !isValidId(orderId)) return fail("SECURITY_ERROR: IDs inválidos");

    try {
      // Validar pertenencia primero
      const existing = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!existing || existing.businessId !== businessId) {
        return fail("SECURITY_ERROR: Pedido no encontrado o no autorizado");
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus }
      });

      return ok(true);
    } catch (error) {
      return fail(getErrorMessage(error));
    }
  }
};