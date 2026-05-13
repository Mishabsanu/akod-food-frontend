"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { customerApi } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
    MapPin, 
    Plus, 
    ShieldCheck, 
    CreditCard, 
    Check, 
    Loader2, 
    ChevronLeft,
    Home,
    Briefcase,
    Building2
} from "lucide-react";

// Load Razorpay Script Helper
const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function CheckoutPage() {
    const { items, cartTotal, cartSubtotal, clearCart } = useCart();
    const router = useRouter();
    
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    
    // New Address State
    const [newAddress, setNewAddress] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await customerApi.getProfile();
            const addrList = res.data.data.addresses || [];
            setAddresses(addrList);
            
            // Auto-select default address
            const defaultAddr = addrList.find((a: any) => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr._id);
            } else if (addrList.length > 0) {
                setSelectedAddressId(addrList[0]._id);
            } else {
                setShowNewAddressForm(true);
            }
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await customerApi.addAddress(newAddress);
            setAddresses(res.data.data);
            toast.success("Address added");
            setShowNewAddressForm(false);
            
            // Select the newly added address
            const latest = res.data.data[res.data.data.length - 1];
            if (latest) setSelectedAddressId(latest._id);
            
            setNewAddress({ street: "", city: "", state: "", zipCode: "", isDefault: false });
        } catch (error) {
            toast.error("Failed to add address");
        }
    };

    const handlePayment = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address");
            return;
        }

        setProcessing(true);
        const resScript = await loadRazorpay();

        if (!resScript) {
            toast.error("Razorpay SDK failed to load");
            setProcessing(false);
            return;
        }

        try {
            const selectedAddr = addresses.find(a => a._id === selectedAddressId);
            const addrStr = `${selectedAddr.street}, ${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.zipCode}`;
            
            // 1. Create order on backend
            const orderRes = await customerApi.createPaymentOrder({
                amount: cartTotal,
                items,
                shippingAddress: addrStr
            });

            const { orderId, amount, currency } = orderRes.data.data;

            // 2. Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                amount: amount,
                currency: currency,
                name: "AKOD Food",
                description: "Purchase from AKOD Food Store",
                order_id: orderId,
                handler: async (response: any) => {
                    try {
                        // 3. Verify payment on backend
                        await customerApi.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        
                        toast.success("Payment Successful!");
                        clearCart();
                        router.push("/orders/success");
                    } catch (error) {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: "", // Will be filled from auth if available
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#10b981"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error("Failed to initiate payment");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <Loader2 className="w-12 h-12 text-black animate-spin" strokeWidth={1} />
        </div>
    );

    return (
        <div className="bg-[#faf9f6] min-h-screen font-sans">
            <div className="max-w-[1200px] mx-auto px-6 py-12">
                
                <div className="flex items-center gap-4 mb-12">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <h1 className="text-3xl font-serif text-gray-900 font-light">Secure Checkout.</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Side: Delivery & Payment */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Section 1: Delivery Address */}
                        <section className="bg-white border border-gray-100 p-10 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                                        <MapPin size={20} />
                                    </div>
                                    <h2 className="text-xl font-serif text-gray-900 font-light">Delivery Address</h2>
                                </div>
                                {!showNewAddressForm && (
                                    <button 
                                        onClick={() => setShowNewAddressForm(true)}
                                        className="text-[10px] uppercase tracking-widest text-brand-primary font-bold hover:underline"
                                    >
                                        Add New
                                    </button>
                                )}
                            </div>

                            {showNewAddressForm ? (
                                <form onSubmit={handleAddAddress} className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2">
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Street Address / Landmark</label>
                                            <input 
                                                required
                                                type="text" 
                                                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors"
                                                placeholder="Building name, Street, Landmark"
                                                value={newAddress.street}
                                                onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">City</label>
                                            <input 
                                                required
                                                type="text" 
                                                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors"
                                                placeholder="City"
                                                value={newAddress.city}
                                                onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">State</label>
                                            <input 
                                                required
                                                type="text" 
                                                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors"
                                                placeholder="State"
                                                value={newAddress.state}
                                                onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Zip Code</label>
                                            <input 
                                                required
                                                type="text" 
                                                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors"
                                                placeholder="Zip Code"
                                                value={newAddress.zipCode}
                                                onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-6 pt-6">
                                        <button 
                                            type="submit"
                                            className="bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light py-4 px-10 hover:bg-brand-primary transition-colors flex items-center gap-3"
                                        >
                                            Save Address
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowNewAddressForm(false)}
                                            className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black py-4 px-6 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {addresses.map((addr) => (
                                        <div 
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            className={`cursor-pointer p-8 relative transition-all duration-300 group ${selectedAddressId === addr._id ? "border border-black bg-white shadow-sm" : "border border-gray-100 bg-[#faf9f6] hover:border-gray-200"}`}
                                        >
                                            {selectedAddressId === addr._id && (
                                                <span className="absolute top-0 right-0 bg-black text-white px-4 py-1.5 text-[8px] uppercase tracking-[0.3em] font-medium">Selected Node</span>
                                            )}
                                            <div className="flex items-start gap-5">
                                                <div className={`p-3 rounded-full ${selectedAddressId === addr._id ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                                    <MapPin className="w-4 h-4" strokeWidth={1.5} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-900 mb-3">{addr.type || "Default"}</h3>
                                                    <p className="text-xs font-light text-gray-500 leading-loose">
                                                        {addr.street},<br />
                                                        {addr.city}, {addr.state} {addr.zipCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Section 2: Payment Method */}
                        <section className="bg-white border border-gray-100 p-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                                    <CreditCard size={20} />
                                </div>
                                <h2 className="text-xl font-serif text-gray-900 font-light">Payment Method</h2>
                            </div>

                            <div className="p-8 border border-brand-primary bg-brand-primary/5 relative overflow-hidden group">
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-6 h-6 rounded-full border-2 border-brand-primary flex items-center justify-center">
                                            <div className="w-3 h-3 bg-brand-primary rounded-full" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Razorpay Secure Payment</p>
                                            <p className="text-xs text-gray-500 mt-1">UPI, Net Banking, Cards & Wallets</p>
                                        </div>
                                    </div>
                                    <Image 
                                        src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
                                        className="h-4 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
                                        alt="Razorpay" 
                                        width={100}
                                        height={16}
                                    />
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl" />
                            </div>

                            <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-400">
                                <ShieldCheck size={14} className="text-brand-primary" />
                                100% Encrypted & Safe Transaction
                            </div>
                        </section>

                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <div className="bg-white border border-gray-100 p-10 shadow-xl shadow-black/5">
                            <h2 className="text-xl font-serif text-gray-900 mb-8 font-light">Order Summary.</h2>
                            
                            <div className="space-y-4 mb-8">
                                {items.map((item) => (
                                    <div key={item.cartId} className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-800 font-medium">{item.product.name}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">{item.quantity} × {item.variant.name}{item.variant.unit}</p>
                                        </div>
                                        <p className="text-xs font-medium text-gray-900">₹{(item.variant.sellingPrice || item.variant.price) * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-50 pt-6 space-y-3 mb-8">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span className="uppercase tracking-widest text-[9px] font-bold">Subtotal</span>
                                    <span>₹{cartSubtotal}</span>
                                </div>
                                <div className="flex justify-between text-xs text-brand-primary font-medium">
                                    <span className="uppercase tracking-widest text-[9px] font-bold">Shipping</span>
                                    <span>Complimentary</span>
                                </div>
                            </div>

                            <div className="border-t-2 border-black pt-6 mb-10 flex justify-between items-end">
                                <span className="uppercase tracking-widest text-[10px] text-gray-400 font-bold">Total Amount</span>
                                <span className="text-3xl font-serif text-gray-900 font-light">₹{cartTotal}</span>
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full bg-black text-white text-[11px] uppercase tracking-[0.4em] font-medium py-6 hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/20 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay Securely Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
