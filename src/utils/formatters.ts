import { appConfig } from '../config/global';

/**
 * Funciones puras de formateo. El locale y currency default se extraen 
 * de la configuración global si no se inyectan explícitamente.
 */

export const formatCurrency = (
  amount: number, 
  currency: string = appConfig.currency, 
  locale: string = appConfig.locale
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (
  date: Date | string, 
  locale: string = appConfig.locale
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};
