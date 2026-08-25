"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { customerApi } from "@/lib/api";
import { 
    ChevronLeft, 
    Truck, 
    MapPin, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    XCircle,
    ShieldCheck,
    Loader2,
    MessageCircle,
    AlertCircle,
    RotateCcw
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const fetchOrderDetails = useCallback(async () => {
        try {
            const res = await customerApi.getOrderDetails(params.id as string);
            setOrder(res.data.data);
        } catch (error) {
            toast.error("Failed to load order details");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    const handleCancelOrder = async () => {
        setCancelling(true);
        try {
            await customerApi.cancelOrder(order._id);
            toast.success("Order has been cancelled successfully");
            setShowCancelModal(false);
            fetchOrderDetails();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <Loader2 className="w-10 h-10 animate-spin text-black" strokeWidth={1.5} />
        </div>
    );

    if (!order) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-xl font-serif text-gray-900 mb-2">Order Not Found</h2>
            <Link href="/profile" className="text-xs uppercase tracking-widest text-brand-primary underline">
                Return to Account &rarr;
            </Link>
        </div>
    );

    const isCancelled = order.status === 'cancelled';
    const canCancel = order.status === 'pending' || order.status === 'processing';

    const steps = [
        { id: 'pending', label: 'Order Placed', icon: Calendar, time: order.createdAt },
        { id: 'processing', label: 'Preparing In Wood-Fire Uruli', icon: Clock, time: null },
        { id: 'shipped', label: 'Dispatched / In Transit', icon: Truck, time: order.shipment?.shippedAt },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle2, time: null },
    ];

    const currentStepIdx = steps.findIndex(s => s.id === order.status);

    return (
        <div className="bg-[#faf9f6] min-h-screen font-sans pb-20">
            <div className="max-w-[1000px] mx-auto px-6 py-10 md:py-16">
                
                {/* Back Button & Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
                    >
                        <ChevronLeft size={16} />
                        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">Back to Account</span>
                    </button>

                    <span className="text-xs font-mono text-gray-500 font-semibold">
                        Order #AKD-{order._id.slice(-8).toUpperCase()}
                    </span>
                </div>

                {/* Cancelled Order Notice Banner */}
                {isCancelled && (
                    <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-xs uppercase tracking-widest font-bold text-red-900 mb-1">
                                    Order Cancelled
                                </h3>
                                <p className="text-xs text-red-800/80 font-light leading-relaxed">
                                    {order.paymentStatus === 'paid' 
                                        ? `Your online payment of ₹${order.totalAmount} will be refunded back to your original payment source within 5–7 banking days.`
                                        : 'This order was cancelled and no charges were incurred.'
                                    }
                                </p>
                            </div>
                        </div>

                        <a 
                            href={`https://wa.me/919048713538?text=${encodeURIComponent(`Hi AKOD Team, I need help with my cancelled order #AKD-${order._id.slice(-8).toUpperCase()}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white border border-red-200 text-red-900 text-[10px] uppercase tracking-widest font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                            WhatsApp Support
                        </a>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Tracking & Items */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Order Status Timeline */}
                        <section className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
                                <h2 className="text-base font-serif font-medium text-gray-900">
                                    {isCancelled ? "Order Status" : "Dispatch & Delivery Timeline"}
                                </h2>
                                <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold border ${
                                    isCancelled 
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : order.status === 'delivered'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            
                            {isCancelled ? (
                                <div className="py-6 text-center text-gray-500 text-xs font-light">
                                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                    <span>Processing has been halted for this cancelled order.</span>
                                </div>
                            ) : (
                                <div className="relative pl-4">
                                    {/* Vertical Line */}
                                    <div className="absolute left-9 top-3 bottom-3 w-[1px] bg-gray-200" />
                                    
                                    <div className="space-y-8 relative">
                                        {steps.map((step, idx) => {
                                            const isCompleted = idx <= currentStepIdx;
                                            const isActive = idx === currentStepIdx;
                                            
                                            return (
                                                <div key={step.id} className={`flex items-start gap-5 transition-opacity duration-300 ${isCompleted ? 'opacity-100' : 'opacity-35'}`}>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 flex-shrink-0 transition-colors ${
                                                        isCompleted ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                        <step.icon size={16} strokeWidth={1.5} />
                                                        {isActive && (
                                                            <div className="absolute inset-0 rounded-full bg-black/10 animate-ping" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                                            {step.label}
                                                        </p>
                                                        {step.time && (
                                                            <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                                                                {new Date(step.time).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        )}
                                                        {isActive && order.status === 'shipped' && order.shipment && (
                                                            <div className="mt-3 p-3 bg-[#faf9f6] border border-gray-200 text-xs">
                                                                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Courier Partner</p>
                                                                <p className="font-bold text-gray-900 mb-2">{order.shipment.courierName}</p>
                                                                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Tracking ID</p>
                                                                <p className="font-mono text-xs font-bold text-brand-primary tracking-wider">{order.shipment.trackingId}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Items Section */}
                        <section className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                                Ordered Provisions ({order.items.length})
                            </h3>
                            <div className="space-y-4">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 items-center py-2 border-b border-gray-100 last:border-0">
                                        <div className="w-14 h-16 bg-[#faf9f6] flex-shrink-0 p-1 border border-gray-200 relative flex items-center justify-center">
                                            <Image 
                                                src={item.product?.images?.[0] || item.product?.image || "/placeholder.png"} 
                                                fill 
                                                className="object-contain p-1" 
                                                alt={item.product?.name || "Product"} 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-medium text-gray-900 truncate">{item.product?.name || 'Artisanal Batch'}</h4>
                                            <p className="text-[10px] text-gray-400 mt-0.5 font-mono uppercase">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right font-mono font-semibold text-xs text-gray-900">
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Right: Summary & Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Financial Overview */}
                        <section className="bg-white border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                Payment Details
                            </h3>
                            <div className="space-y-2 mb-4 text-xs font-light text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-gray-900">₹{order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-green-700 font-medium">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment Method</span>
                                    <span className="font-mono text-[11px] uppercase">Razorpay Online</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment Status</span>
                                    <span className={`font-mono text-[10px] uppercase font-bold ${
                                        order.paymentStatus === 'paid' ? 'text-green-700' : 'text-amber-700'
                                    }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Paid</span>
                                <span className="text-2xl font-serif text-gray-900 font-light">₹{order.totalAmount}</span>
                            </div>
                        </section>

                        {/* Shipping Destination */}
                        <section className="bg-white border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                                Delivery Address
                            </h3>
                            <div className="flex items-start gap-2.5 text-gray-600 text-xs font-light leading-relaxed">
                                <MapPin size={15} className="mt-0.5 text-gray-400 flex-shrink-0" />
                                <p>{order.shippingAddress}</p>
                            </div>
                        </section>

                        {/* Cancel Order CTA (if eligible) */}
                        {canCancel && (
                            <div className="bg-white border border-gray-200 p-6 shadow-sm text-center">
                                <p className="text-[11px] text-gray-500 font-light mb-3">
                                    Need to change something? You can cancel your order before it gets dispatched.
                                </p>
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="w-full py-2.5 bg-white border border-red-300 text-red-700 text-[10px] uppercase tracking-widest font-semibold hover:bg-red-50 transition-colors"
                                >
                                    Cancel This Order
                                </button>
                            </div>
                        )}

                        {/* Direct Support */}
                        <a 
                            href="https://wa.me/919048713538"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 bg-[#25D366] text-white text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#20b859] transition-colors shadow-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Need Help? WhatsApp Us
                        </a>

                    </div>

                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-serif text-gray-900 text-center font-light mb-2">
                            Cancel Order #AKD-{order._id.slice(-8).toUpperCase()}?
                        </h3>
                        <p className="text-xs text-gray-500 text-center font-light leading-relaxed mb-6">
                            Are you sure you want to cancel this order? If you paid online, your refund will be automatically processed back to your account in 5–7 banking days.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="flex-1 py-3 bg-red-600 text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {cancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Cancellation"}
                            </button>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 text-[10px] uppercase tracking-widest font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Keep Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
