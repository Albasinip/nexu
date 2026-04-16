/**
 * Banderas simples para habilitar/deshabilitar funcionalidades o módulos
 * de forma progresiva sin afectar a todos los tenants.
 */

export const featureFlags = {
  // Transición a mocks
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS === 'true',
  
  // Módulos del Vendedor
  enableCustomersModule: true,
  enableReportsModule: false,
  enableIntegrationsModule: false,
};
