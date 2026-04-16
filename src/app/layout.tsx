import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NEXU",
    template: "%s — NEXU",
  },
  description:
    "Gestiona pedidos, clientes y tu operación desde un solo lugar. NEXU conecta negocios con personas en una experiencia simple, rápida y escalable.",
  applicationName: "NEXU",
  keywords: [
    "pedidos online",
    "menú digital",
    "sistema para restaurantes",
    "gestión de pedidos",
    "SaaS restaurantes",
  ],
  authors: [{ name: "NEXU" }],
  creator: "NEXU",
  metadataBase: new URL("https://nexu.cl"), // cámbialo cuando tengas dominio real
  openGraph: {
    title: "NEXU — Plataforma de pedidos y gestión",
    description:
      "Centraliza pedidos, administra tu negocio y conecta con clientes en una sola plataforma.",
    url: "https://nexu.cl",
    siteName: "NEXU",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXU",
    description:
      "Ecosistema de pedidos y gestión para negocios modernos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="app-root">
        <div className="app-shell">
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}