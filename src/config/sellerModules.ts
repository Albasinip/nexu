import { featureFlags } from './featureFlags';

export type SellerModuleId = 'dashboard' | 'products' | 'orders' | 'customers' | 'reports' | 'integrations';

export interface SellerModule {
  id: SellerModuleId;
  title: string;
  path: string;
  iconName: string;
  description?: string;
  // Removido "enabled", ahora es pura configuración estática.
}

export const sellerModules: SellerModule[] = [
  { id: 'dashboard', title: 'Resumen', path: '/dashboard', iconName: 'LayoutDashboard' },
  { id: 'products', title: 'Productos', path: '/products', iconName: 'Package' },
  { id: 'orders', title: 'Pedidos', path: '/orders', iconName: 'ShoppingCart' },
  { id: 'customers', title: 'Clientes', path: '/customers', iconName: 'Users', description: 'Directorio de clientes recurrentes' },
  { id: 'reports', title: 'Reportes', path: '/reports', iconName: 'BarChart3' },
  { id: 'integrations', title: 'Integraciones', path: '/integrations', iconName: 'Blocks' }
];

/**
 * Función central que decide la visibilidad resolviéndola con los feature flags 
 * o permisos sin acoplar el objeto de configuración maestro directamente.
 */
export const getActiveSellerModules = (): SellerModule[] => {
  return sellerModules.filter(module => {
    switch(module.id) {
      case 'customers': return featureFlags.enableCustomersModule;
      case 'reports': return featureFlags.enableReportsModule;
      case 'integrations': return featureFlags.enableIntegrationsModule;
      default: return true; // dashboard, products, orders son core
    }
  });
};
