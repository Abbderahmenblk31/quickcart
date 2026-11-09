import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/context/CartContext';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'QuickCart — High-Performance Headless E-Commerce Platform',
  description: 'Next-generation headless e-commerce store with instant faceted search, optimistic cart calculations, and idempotent checkout.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <CartProvider>
          <StoreHeader />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
