import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#eba715',
  viewportFit: 'cover',
};
import { Playfair_Display, Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import SplashScreen from '@/components/layout/SplashScreen';

const serifFont = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const adminFont = Inter({
  subsets: ['latin'],
  variable: '--font-admin',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kavyasripickles.com'),
  title: 'Kavyasri Pickles | Traditional Taste, Homemade Love',
  description:
    'Authentic South Indian homemade pickles handcrafted with traditional recipes, cold-pressed oils, and sun-cured spices. Mango, Gongura, Chicken, Mutton, Garlic, Lemon, and more.',
  keywords: [
    'Indian pickles',
    'Avakaya Mango Pickle',
    'Gongura Pachadi',
    'Homemade Chicken Pickle',
    'Traditional Indian Food',
    'Kavyasri Pickles',
  ],
  openGraph: {
    title: 'Kavyasri Pickles — Traditional Taste, Homemade Love',
    description:
      'Authentic homemade pickles crafted with 70-year-old family recipes and pure wood-pressed oils. Delivered fresh across India.',
    type: 'website',
    images: ['/images/logo.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable} ${adminFont.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917] antialiased selection:bg-[#9e1b1e] selection:text-white">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <SplashScreen />
                {children}
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
