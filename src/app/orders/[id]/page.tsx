"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { customerApi } from "@/lib/api";
import { 
    ChevronLeft, 
    Package, 
    Truck, 
    MapPin, 
    Calendar, 
    ArrowRight, 
    CheckCircle2, 
    Clock, 
    XCircle,
    ShieldCheck,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [params.id]);

    const fetchOrderDetails = async () => {
        try {
            const res = await customerApi.getOrderDetails(params.id as string);
            setOrder(res.data.data);
        } catch (error) {
            toast.error("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <Loader2 className="w-12 h-12 animate-spin text-black" strokeWidth={1} />
        </div>
    );

    if (!order) return <div className="p-20 text-center">Order not found.</div>;

    const steps = [
        { id: 'pending', label: 'Order Placed', icon: Calendar, time: order.createdAt },
        { id: 'processing', label: 'Preparing', icon: Clock, time: null },
        { id: 'shipped', label: 'In Transit', icon: Truck, time: order.shipment?.shippedAt },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle2, time: null },
    ];

    const currentStepIdx = steps.findIndex(s => s.id === order.status);

    return (
        <div className="bg-[#faf9f6] min-h-screen font-sans pb-20">
            <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
                
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-3 text-gray-400 hover:text-black transition-colors mb-12 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back to Account</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left: Tracking & Summary */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Order Status Timeline */}
                        <section className="bg-white border border-gray-100 p-10">
                            <h2 className="text-xl font-serif text-gray-900 mb-12 font-light">Tracking Selection.</h2>
                            
                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gray-100" />
                                
                                <div className="space-y-12 relative">
                                    {steps.map((step, idx) => {
                                        const isCompleted = idx <= currentStepIdx;
                                        const isActive = idx === currentStepIdx;
                                        
                                        return (
                                            <div key={step.id} className={`flex items-start gap-8 transition-opacity duration-500 ${isCompleted ? 'opacity-100' : 'opacity-30'}`}>
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-colors ${isCompleted ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <step.icon size={20} strokeWidth={1.5} />
                                                    {isActive && (
                                                        <div className="absolute inset-0 rounded-full bg-black/10 animate-ping" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold uppercase tracking-widest ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </p>
                                                    {step.time && (
                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            {new Date(step.time).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    )}
                                                    {isActive && order.status === 'shipped' && order.shipment && (
                                                        <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-sm">
                                                            <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-2">Courier Partner</p>
                                                            <p className="text-xs font-bold text-gray-900">{order.shipment.courierName}</p>
                                                            <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-4 mb-2">Tracking Identification</p>
                                                            <p className="text-xs font-bold text-brand-primary tracking-widest">{order.shipment.trackingId}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        {/* Items Section */}
                        <section className="bg-white border border-gray-100 p-10">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-10">Artisan Curation</h3>
                            <div className="space-y-8">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-6 items-center">
                                        <div className="w-20 h-24 bg-[#faf9f6] flex-shrink-0 p-2 overflow-hidden border border-gray-50">
                                            <img src={item.product?.images?.[0] || "/placeholder.png"} className="w-full h-full object-contain" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">{item.product?.name}</h4>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right font-medium text-sm">
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Right: Summary & Identity */}
                    <div className="lg:col-span-4 space-y-12">
                        
                        {/* Summary */}
                        <section className="bg-white border border-gray-100 p-10">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-8">Financial Overview</h3>
                            <div className="space-y-4 mb-8 pb-8 border-b border-gray-50">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span className="uppercase tracking-widest">Subtotal</span>
                                    <span>₹{order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-xs text-emerald-500 font-medium">
                                    <span className="uppercase tracking-widest">Logistics</span>
                                    <span>Complimentary</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Amount</span>
                                <span className="text-3xl font-serif text-gray-900 font-light tracking-tighter">₹{order.totalAmount}</span>
                            </div>
                        </section>

                        {/* Identity & Address */}
                        <section className="bg-white border border-gray-100 p-10">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-8">Logistics Destination</h3>
                            <div className="flex items-start gap-4 text-gray-600">
                                <MapPin size={18} className="mt-1 flex-shrink-0" />
                                <p className="text-sm leading-relaxed font-light">
                                    {order.shippingAddress}
                                </p>
                            </div>
                        </section>

                        {/* Security Badge */}
                        <div className="px-6 flex items-center justify-center gap-4 text-[9px] uppercase tracking-[0.3em] text-gray-400 border border-gray-100 py-4 italic">
                            <ShieldCheck size={14} className="text-brand-primary" />
                            Authentic Selection Guaranteed
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
