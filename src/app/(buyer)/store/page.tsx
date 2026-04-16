import { redirect } from 'next/navigation';

export default function StoreRedirectPage() {
  // El Marketplace se ha fusionado arquitectónicamente con el Dashboard del comprador.
  // Toda la interacción de descubrimiento ocurre ahora en /user/profile
  redirect('/user/profile');
}
