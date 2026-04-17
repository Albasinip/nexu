/**
 * Tipos base compartidos (agnósticos a Prisma).
 * Actúan como contratos para UI y Servicios.
 */

export type ServiceResult<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string; status?: number };

export type AppRole = 'SELLER' | 'BUYER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: AppRole;
  createdAt: Date;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  city?: string | null;
  country?: string | null;
  ownerId: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  price: number;
  category?: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  businessId: string;
  buyerId: string | null;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtTime: number;
}

export interface OrderItemWithProduct extends OrderItem {
  product: Pick<Product, 'name'>;
}

export interface OrderWithDetails extends Order {
  customerName: string | null;
  customerPhone: string | null;
  address: string | null;
  notes: string | null;
  buyer?: Pick<User, 'name' | 'email'>;
  items: OrderItemWithProduct[];
}

// Tipo preparado para el futuro módulo de Clientes
export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string | null;
  totalOrders: number;
  totalSpent: number;
}
