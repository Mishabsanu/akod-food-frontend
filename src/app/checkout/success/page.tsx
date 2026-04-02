import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 bg-brand-bgLight">
            <div className="bg-white p-12 rounded-3xl shadow-xl flex flex-col items-center max-w-lg w-full border border-gray-50 text-center">
                <CheckCircle className="w-20 h-20 text-brand-primary mb-6" />
                <h1 className="text-4xl font-serif text-brand-text mb-4">Order Confirmed</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Thank you for your purchase. Your luxury treats are being crafted and will be shipped to you momentarily.
                    <br /><br />
                    <span className="font-semibold text-brand-text">Order # {Math.floor(Math.random() * 1000000)}</span>
                </p>
                <div className="flex flex-col w-full gap-4 mt-2">
                    <Link href="/products" className="bg-brand-primary text-white w-full py-4 rounded-xl uppercase tracking-widest text-sm font-semibold hover:bg-brand-text transition-colors duration-300">
                        Continue Shopping
                    </Link>
                    <Link href="/profile" className="bg-transparent text-brand-text border border-brand-text w-full py-4 rounded-xl uppercase tracking-widest text-sm font-semibold hover:bg-gray-50 transition-colors duration-300">
                        View My Order History
                    </Link>
                </div>
            </div>
        </div>
    );
}
