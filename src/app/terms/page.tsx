import Link from "next/link";
import { ShieldAlert, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "Terms & Conditions | AKOD Foods",
    description: "Terms and conditions for placing orders with AKOD Foods.",
};

export default function TermsPage() {
    const terms = [
        {
            title: "Order Placement & Modifications",
            desc: "Orders once placed cannot be cancelled or modified under any circumstances.",
        },
        {
            title: "Payment Methods",
            desc: "Cash on Delivery (COD) is currently not available. Payments can be made securely online using Credit Card, Debit Card, UPI, Net Banking, or other available online payment methods.",
        },
        {
            title: "Shipping & Delivery Charges",
            desc: "Shipping or delivery charges, if applicable, will be clearly mentioned at the time of checkout before you make payment.",
        },
        {
            title: "Package Inspection upon Delivery",
            desc: "All products are carefully inspected and securely packed before dispatch. Customers are requested to check the exterior condition of the package upon delivery.",
        },
        {
            title: "No Returns or Exchanges on Food Items",
            desc: "Due to hygiene and food safety standards, opened, used, or consumed food products cannot be returned or exchanged.",
        },
        {
            title: "Refund Policy",
            desc: "No refunds are provided once an order has been successfully placed, except where required under applicable law or in cases specifically approved in writing by AKOD Foods.",
        },
        {
            title: "Damaged, Defective or Incorrect Items",
            desc: "If a product is received damaged, incorrect, or defective, please contact us promptly within 24 hours of delivery with your order details and supporting unboxing photographs/videos. The matter will be thoroughly reviewed by our team.",
        },
        {
            title: "Product Representation & Natural Variations",
            desc: "Product images on the website are for representation purposes only. Being handcrafted natural food products, there may be slight variations in colour, texture, taste, or appearance between batches.",
        },
        {
            title: "Accuracy of Customer Details",
            desc: "Customers are solely responsible for providing the complete and correct delivery address, pin code, and active contact phone number at the time of checkout.",
        },
        {
            title: "Right to Amend Terms",
            desc: "AKOD Foods reserves the right to update or amend these Terms & Conditions at any time without prior notice.",
        },
    ];

    return (
        <div className="bg-[#faf9f6] min-h-screen font-sans selection:bg-brand-primary/20 selection:text-black pb-28">
            
            {/* Header Banner */}
            <div className="w-full bg-white border-b border-gray-200 py-12 md:py-16 mb-12">
                <div className="max-w-[1000px] mx-auto px-6 sm:px-12">
                    <div className="flex items-center gap-2 mb-3">
                        <Link href="/" className="text-[9px] uppercase tracking-[0.3em] font-medium text-gray-400 hover:text-black transition-colors flex items-center gap-1.5">
                            <ArrowLeft className="w-3 h-3" /> Home
                        </Link>
                        <span className="text-gray-300 text-xs">/</span>
                        <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-brand-primary">
                            Legal
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 font-light tracking-tight mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-sm font-light text-gray-500 max-w-xl leading-relaxed">
                        Please review our terms carefully before placing an order. By placing an order on our website, you acknowledge and agree to these Terms & Conditions.
                    </p>
                </div>
            </div>

            {/* Terms Content Container */}
            <div className="max-w-[1000px] mx-auto px-6 sm:px-12">
                <div className="bg-white border border-gray-200 p-8 sm:p-12 space-y-8">
                    
                    {terms.map((term, index) => (
                        <div key={index} className="flex gap-4 sm:gap-6 items-start pb-8 border-b border-gray-100 last:border-b-0 last:pb-0">
                            <span className="text-xs font-mono text-gray-400 font-medium pt-0.5 min-w-[28px]">
                                {String(index + 1).padStart(2, "0")}.
                            </span>
                            <div className="flex-1">
                                <h3 className="text-base font-serif text-gray-900 font-normal mb-1.5">
                                    {term.title}
                                </h3>
                                <p className="text-sm font-light text-gray-600 leading-relaxed">
                                    {term.desc}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Closing Note */}
                    <div className="pt-6 border-t border-gray-200 bg-[#faf9f6] -mx-8 -mb-8 sm:-mx-12 sm:-mb-12 p-8 sm:p-12">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-serif text-gray-900 font-medium mb-1">
                                    Customer Acknowledgment
                                </h4>
                                <p className="text-xs font-light text-gray-600 leading-relaxed">
                                    By placing an order on our website, you acknowledge and agree to these Terms & Conditions. For any support or inquiries, please contact our team at{" "}
                                    <a href="mailto:support@akodfood.com" className="text-black underline hover:text-brand-primary">
                                        support@akodfood.com
                                    </a>.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
