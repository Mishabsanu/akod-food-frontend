import UIProvider from "@/providers/UIProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PromoModal from "@/components/ui/PromoModal";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.FRONTEND_URL || "https://akodfood.com"),
  title: {
    default: "AKOD FOOD | Artisanal Kerala Heritage Provisions & Chips",
    template: "%s | AKOD FOOD",
  },
  description:
    "Handcrafted Kerala Nendran banana chips, jackfruit crisps, and traditional provisions prepared in 100% pure cold-pressed coconut oil over wood-fire brass kettles.",
  keywords: [
    "AKOD FOOD",
    "Kerala Banana Chips",
    "Cold Pressed Coconut Oil Chips",
    "Jackfruit Chips",
    "Tapioca Chips",
    "Artisanal Kerala Snacks",
    "Traditional Woodfire Cooking",
    "Premium Indian Provisions"
  ],
  authors: [{ name: "AKOD Foods" }],
  creator: "AKOD Foods",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://akodfood.com",
    siteName: "AKOD FOODS",
    title: "AKOD FOOD | Artisanal Kerala Heritage Provisions & Chips",
    description:
      "Handcrafted Kerala snacks prepared in 100% pure cold-pressed coconut oil over wood-fire brass kettles.",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "AKOD Foods Heritage Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AKOD FOOD | Artisanal Kerala Heritage Provisions",
    description:
      "Handcrafted Kerala snacks prepared in 100% pure cold-pressed coconut oil over wood-fire brass kettles.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ReduxProvider>
          <UIProvider>
            <AuthProvider>
              <CartProvider>
                <div className="flex flex-col min-h-screen text-brand-text bg-brand-bgLight selection:bg-brand-primary selection:text-white">
                <Toaster 
                  position="top-right" 
                  expand={false}
                  richColors={false}
                  closeButton
                  toastOptions={{
                    style: {
                      background: '#ffffff',
                      color: '#1a1a1a',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0px',
                      padding: '16px 24px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      fontFamily: 'serif',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    },
                  }}
                />
                  <TopBar />
                  <Navbar />
                  <main className="flex-1 w-full">{children}</main>
                  <Footer />
                  <PromoModal />
                </div>
              </CartProvider>
            </AuthProvider>
          </UIProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
