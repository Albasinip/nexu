import { Customer, ServiceResult } from "@/types";
import { CustomerInputDTO } from "./customers.schema";
import { featureFlags } from "@/config/featureFlags";

/**
 * Mock DB en memoria para desarrollo.
 * Conserva estado mientras el dev server siga activo.
 */
let mockCustomersDb: Customer[] = [];

/**
 * ==============================
 * Types
 * ==============================
 */

type CreateCustomerData = CustomerInputDTO;

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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Error interno del servidor";
}

function isValidId(value: string): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function createMockCustomerId(): string {
  return `mock-customer-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function createDefaultMockCustomers(businessId: string): Customer[] {
  return [
    {
      id: `c-${Date.now()}-1`,
      businessId,
      name: "Cliente Frecuente",
      email: "vip@mail.com",
      phone: "+123456",
      totalOrders: 12,
      totalSpent: 45000,
    },
    {
      id: `c-${Date.now()}-2`,
      businessId,
      name: "Juan Nuevo",
      email: "juan@mail.com",
      phone: null,
      totalOrders: 0,
      totalSpent: 0,
    },
  ];
}

function getCustomersByBusinessId(businessId: string): Customer[] {
  return mockCustomersDb.filter((customer) => customer.businessId === businessId);
}

function seedCustomersIfNeeded(businessId: string): Customer[] {
  const existingCustomers = getCustomersByBusinessId(businessId);

  if (existingCustomers.length > 0 || !featureFlags.useMocks) {
    return existingCustomers;
  }

  const seededCustomers = createDefaultMockCustomers(businessId);
  mockCustomersDb.push(...seededCustomers);

  return seededCustomers;
}

function buildMockCustomer(
  businessId: string,
  data: CreateCustomerData
): Customer {
  return {
    id: createMockCustomerId(),
    businessId,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    totalOrders: 0,
    totalSpent: 0,
  };
}

/**
 * ==============================
 * Customers Service
 * ==============================
 */

export const customersService = {
  async listCustomers(businessId: string): Promise<ServiceResult<Customer[]>> {
    if (!isValidId(businessId)) {
      return fail("SECURITY_ERROR: businessId no provisto en la consulta");
    }

    try {
      const customers = seedCustomersIfNeeded(businessId);
      return ok(customers);
    } catch (error) {
      return fail(getErrorMessage(error));
    }
  },

  async createCustomer(
    businessId: string,
    data: CustomerInputDTO
  ): Promise<ServiceResult<Customer>> {
    if (!isValidId(businessId)) {
      return fail("SECURITY_ERROR: businessId inválido");
    }

    try {
      const newCustomer = buildMockCustomer(businessId, data);
      mockCustomersDb.push(newCustomer);

      return ok(newCustomer);
    } catch (error) {
      return fail(getErrorMessage(error));
    }
  },
};