"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { customerApi } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
    MapPin, 
    Plus, 
    Check, 
    Loader2, 
    ChevronLeft,
    Lock,
    ShieldCheck,
    Truck,
    AlertCircle,
    Sparkles
} from "lucide-react";

// Load Razorpay Script Helper
const loadRazorpay = () => {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && (window as any).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
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
    
    // Customer Contact State
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    
    // New Address State
    const [newAddress, setNewAddress] = useState({
        type: "Home",
        street: "",
        city: "",
        state: "Kerala",
        zipCode: "",
        isDefault: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await customerApi.getProfile();
            const profile = res.data.data;
            
            if (profile) {
                setCustomerName(profile.name || "");
                setCustomerEmail(profile.email || "");
                setCustomerPhone(profile.phone || "");
                
                const addrList = profile.addresses || [];
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
            }
        } catch (error) {
            toast.error("Please log in to proceed to checkout");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await customerApi.addAddress(newAddress);
            setAddresses(res.data.data);
            toast.success("Delivery address saved");
            setShowNewAddressForm(false);
            
            // Select the newly added address
            const latest = res.data.data[res.data.data.length - 1];
            if (latest) setSelectedAddressId(latest._id);
            
            setNewAddress({ type: "Home", street: "", city: "", state: "Kerala", zipCode: "", isDefault: false });
        } catch (error) {
            toast.error("Failed to add address");
        }
    };

    const handlePayment = async () => {
        // 1. Phone number validation
        const cleanPhone = customerPhone.replace(/\D/g, "");
        if (!cleanPhone || cleanPhone.length !== 10) {
            toast.error("Please enter a valid 10-digit mobile number for delivery updates");
            return;
        }

        // 2. Address validation
        if (!selectedAddressId) {
            toast.error("Please select or add a delivery address");
            return;
        }

        // 3. Cart validation
        if (!items || items.length === 0) {
            toast.error("Your cart is empty");
            router.push("/products");
            return;
        }

        setProcessing(true);
        const resScript = await loadRazorpay();

        if (!resScript) {
            toast.error("Payment gateway failed to initialize. Please try again.");
            setProcessing(false);
            return;
        }

        try {
            // Update profile with phone and name if changed
            try {
                await customerApi.updateProfile({
                    name: customerName,
                    phone: cleanPhone
                });
            } catch (err) {
                // Non-blocking profile sync
            }

            const selectedAddr = addresses.find(a => a._id === selectedAddressId);
            const addrStr = selectedAddr 
                ? `${customerName} (Phone: +91 ${cleanPhone}), ${selectedAddr.street}, ${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.zipCode}`
                : `Phone: +91 ${cleanPhone}`;
            
            // 1. Create order on backend
            const orderRes = await customerApi.createPaymentOrder({
                amount: cartTotal,
                items,
                shippingAddress: addrStr
            });

            const { orderId, amount, currency, keyId } = orderRes.data.data;
            const razorpayKey = keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SoQcfwsy2H0laK";

            // 2. Initialize Razorpay Checkout
            const options = {
                key: razorpayKey,
                amount: amount,
                currency: currency || "INR",
                name: "AKOD Foods",
                description: "Artisanal South Indian Provisions",
                order_id: orderId,
                handler: async (response: any) => {
                    try {
                        // 3. Verify payment on backend
                        await customerApi.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        
                        toast.success("Payment Verified & Order Confirmed!");
                        clearCart();
                        router.push("/orders/success");
                    } catch (error) {
                        toast.error("Payment verification failed. Please contact AKOD support.");
                    }
                },
                prefill: {
                    name: customerName,
                    email: customerEmail,
                    contact: cleanPhone
                },
                theme: {
                    color: "#000000"
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (resp: any) {
                toast.error(resp.error?.description || "Payment failed or cancelled");
                setProcessing(false);
            });
            rzp.open();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to initiate payment. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <Loader2 className="w-10 h-10 text-black animate-spin" strokeWidth={1.5} />
        </div>
    );

    return (
        <div className="bg-[#faf9f6] min-h-screen font-sans selection:bg-brand-primary/20 selection:text-black py-10 sm:py-16">
            
            {/* Centered Luxury Container */}
            <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-gray-200 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-brand-primary">
                                Secure Checkout
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-light text-gray-900 tracking-tight">
                            Shipping &amp; Payment.
                        </h1>
                    </div>

                    <Link 
                        href="/cart" 
                        className="text-[10px] uppercase tracking-[0.25em] font-medium text-gray-500 hover:text-black transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" /> Return to Bag
                    </Link>
                </div>

                {/* 2-Column Framed Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    
                    {/* Left Column: Form Sections (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* 1. Contact Info Card */}
                        <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5">01</span>
                                    <h2 className="text-sm font-serif font-medium text-gray-900">Delivery Contact</h2>
                                </div>
                                {customerPhone && customerPhone.length === 10 && (
                                    <span className="text-[9px] uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 font-medium flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Verified
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] font-medium text-gray-400 mb-2">
                                        Full Name <span className="text-brand-primary">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="ENTER FULL NAME"
                                        className="w-full bg-transparent border-b border-gray-300 focus:border-black py-2.5 text-xs text-gray-900 tracking-wider outline-none transition-all placeholder:text-gray-300 uppercase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] font-medium text-gray-400 mb-2">
                                        Mobile Number <span className="text-brand-primary">*</span>
                                    </label>
                                    <div className="flex items-center border-b border-gray-300 focus-within:border-black transition-all">
                                        <span className="text-xs font-mono text-gray-400 pr-2 py-2.5">+91</span>
                                        <input 
                                            type="tel" 
                                            required
                                            maxLength={10}
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                                            placeholder="10-DIGIT NUMBER"
                                            className="flex-1 bg-transparent py-2.5 text-xs font-mono text-gray-900 tracking-wider outline-none placeholder:text-gray-300"
                                        />
                                    </div>
                                    {(!customerPhone || customerPhone.length !== 10) && (
                                        <p className="text-[10px] text-amber-700 mt-1.5 flex items-center gap-1 font-light">
                                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                            <span>Please provide 10-digit mobile for courier tracking.</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Delivery Address Card */}
                        <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5">02</span>
                                    <h2 className="text-sm font-serif font-medium text-gray-900">Shipping Destination</h2>
                                </div>
                                {!showNewAddressForm && (
                                    <button 
                                        onClick={() => setShowNewAddressForm(true)}
                                        className="text-[10px] uppercase tracking-wider text-black font-semibold hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Address
                                    </button>
                                )}
                            </div>

                            {showNewAddressForm ? (
                                <form onSubmit={handleAddAddress} className="space-y-6 animate-in fade-in duration-200 p-5 bg-[#faf9f6] border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs uppercase tracking-widest font-semibold text-gray-900">New Address</span>
                                        <div className="flex gap-1.5">
                                            {["Home", "Work", "Other"].map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setNewAddress({ ...newAddress, type: t })}
                                                    className={`px-3 py-1 text-[9px] uppercase tracking-wider font-medium border transition-colors ${
                                                        newAddress.type === t ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-600"
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-1.5">Street Address / Landmark *</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full bg-transparent border-b border-gray-300 focus:border-black py-2.5 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-300"
                                            placeholder="Flat/House No., Street, Landmark"
                                            value={newAddress.street}
                                            onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-1.5">City *</label>
                                            <input 
                                                required
                                                type="text" 
                                                className="w-full bg-transparent border-b border-gray-300 focus:border-black py-2.5 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-300"
                                                placeholder="City"
                                                value={newAddress.city}
                                                onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-1.5">State *</label>
                                            <input 
                                                required
                                                type="text" 
                                                className="w-full bg-transparent border-b border-gray-300 focus:border-black py-2.5 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-300"
                                                placeholder="State"
                                                value={newAddress.state}
                                                onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-1.5">PIN Code *</label>
                                            <input 
                                                required
                                                type="text" 
                                                maxLength={6}
                                                className="w-full bg-transparent border-b border-gray-300 focus:border-black py-2.5 text-xs font-mono text-gray-900 outline-none transition-colors placeholder:text-gray-300"
                                                placeholder="6-digit PIN"
                                                value={newAddress.zipCode}
                                                onChange={e => setNewAddress({...newAddress, zipCode: e.target.value.replace(/\D/g, '')})}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            type="submit"
                                            className="bg-black text-white text-[10px] uppercase tracking-[0.2em] font-medium py-3 px-6 hover:bg-brand-primary hover:text-black transition-colors"
                                        >
                                            Save &amp; Deliver Here
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowNewAddressForm(false)}
                                            className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-black py-3 px-3 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {addresses.map((addr) => {
                                        const isSelected = selectedAddressId === addr._id;
                                        return (
                                            <div 
                                                key={addr._id}
                                                onClick={() => setSelectedAddressId(addr._id)}
                                                className={`cursor-pointer p-4 relative transition-all duration-150 border ${
                                                    isSelected 
                                                        ? "border-2 border-black bg-white shadow-sm ring-1 ring-black/10" 
                                                        : "border-gray-200 bg-[#faf9f6] hover:border-gray-400"
                                                }`}
                                            >
                                                {isSelected && (
                                                    <span className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 text-[8px] uppercase tracking-widest font-medium">
                                                        Selected
                                                    </span>
                                                )}
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                        isSelected ? 'bg-black text-white' : 'border border-gray-300 text-gray-400'
                                                    }`}>
                                                        {isSelected ? <Check className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-[10px] uppercase tracking-wider font-semibold text-gray-900 mb-1">{addr.type || "Delivery Address"}</h3>
                                                        <p className="text-xs font-light text-gray-600 leading-relaxed">
                                                            {addr.street},<br />
                                                            {addr.city}, {addr.state} {addr.zipCode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* 3. Payment Method Card */}
                        <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
                                <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5">03</span>
                                <h2 className="text-sm font-serif font-medium text-gray-900">Payment Gateway</h2>
                            </div>

                            <div className="p-5 border border-black bg-[#faf9f6] flex items-center justify-between">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-black rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">Razorpay Secure Online Payment</p>
                                        <p className="text-[11px] text-gray-500 font-light">UPI (GPay / PhonePe / Paytm), Cards &amp; NetBanking</p>
                                    </div>
                                </div>
                                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-mono">Instant</span>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 font-light">
                                <Lock className="w-3.5 h-3.5 text-brand-primary" />
                                <span>256-Bit Encrypted &amp; PCI-DSS Compliant</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary (5 Cols) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24">
                        <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
                            
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-6">
                                <h2 className="text-base font-serif font-medium text-gray-900">Order Summary</h2>
                                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                                    {items.length} {items.length === 1 ? "Item" : "Items"}
                                </span>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.cartId} className="flex items-center gap-3.5 py-2 border-b border-gray-100 last:border-0">
                                        <div className="w-12 h-14 bg-[#faf9f6] border border-gray-200 relative flex-shrink-0 flex items-center justify-center p-1">
                                            <Image 
                                                src={item.product?.image || item.product?.images?.[0] || "/placeholder.png"} 
                                                alt={item.product.name} 
                                                fill 
                                                className="object-contain p-0.5" 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-900 font-medium truncate">{item.product.name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                                Qty: {item.quantity} &bull; {item.variant.name}{item.variant.unit || ''}
                                            </p>
                                        </div>
                                        <p className="text-xs font-semibold text-gray-900 font-mono">
                                            ₹{(item.variant.sellingPrice || item.variant.price) * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6 text-xs font-light text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-gray-900">₹{cartSubtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-green-700 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Truck className="w-3.5 h-3.5" /> Express Shipping
                                    </span>
                                    <span>FREE</span>
                                </div>
                            </div>

                            {/* Total Due */}
                            <div className="border-t-2 border-black pt-4 mb-6 flex justify-between items-baseline">
                                <div>
                                    <span className="uppercase tracking-widest text-[9px] text-gray-400 font-bold block">Total Amount</span>
                                    <span className="text-[10px] text-gray-400">Inclusive of all taxes</span>
                                </div>
                                <span className="text-3xl font-serif text-gray-900 font-light">₹{cartTotal}</span>
                            </div>

                            {/* Pay Action Button */}
                            <button 
                                onClick={handlePayment}
                                disabled={processing || (!customerPhone || customerPhone.length !== 10)}
                                className="w-full bg-black text-white text-[10px] uppercase tracking-[0.25em] font-medium py-4 hover:bg-brand-primary hover:text-black transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Connecting to Gateway...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-3.5 h-3.5" />
                                        Pay ₹{cartTotal} Securely Now &rarr;
                                    </>
                                )}
                            </button>

                            {/* Terms Reminder */}
                            <p className="text-[10px] text-gray-400 font-light text-center mt-4 leading-relaxed">
                                By placing this order you agree to AKOD&apos;s <Link href="/terms" className="underline text-gray-600 hover:text-black">Terms &amp; Conditions</Link>. Orders once placed cannot be cancelled.
                            </p>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-[9px] uppercase tracking-wider text-gray-400 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                                <span>100% Authentic Kerala Provisions</span>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
