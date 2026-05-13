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
  title:
    "AKOD FOOD | The Premium Heritage Collection",
  description:
    "Elevating South Indian snacking to an art form. Discover our meticulously crafted chips, born from pristine ingredients and generations of mastery.",
  keywords:
    "AKOD FOOD, Premium Chips, Banana Chips, Jackfruit Chips, Tapioca Chips, Luxury Snacking, Kerala Shacks",
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
                    success: {
                      style: {
                        borderLeft: '4px solid #10b981', // Emerald
                      }
                    },
                    error: {
                      style: {
                        borderLeft: '4px solid #ef4444',
                      }
                    },
                    info: {
                      style: {
                        borderLeft: '4px solid #3b82f6',
                      }
                    }
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
