import UIProvider from "@/providers/UIProvider";
import { CartProvider } from "@/context/CartContext";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PromoModal from "@/components/ui/PromoModal";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
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
        <UIProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen text-brand-text bg-brand-bgLight selection:bg-brand-primary selection:text-white">
              <TopBar />
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
              <PromoModal />
            </div>
          </CartProvider>
        </UIProvider>
      </body>
    </html>
  );
}
