"use client";

import { useState } from "react";
import { User, Package, Lock, LogOut, ChevronRight, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

type Tab = "personal" | "addresses" | "orders" | "password";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<Tab>("personal");
    const router = useRouter();

    const handleLogout = () => {
        router.push("/");
    };

    return (
        <div className="bg-[#faf9f6] min-h-screen pb-32 font-sans selection:bg-brand-primary/20 selection:text-black">
            
            {/* Ultra-Premium Header */}
            <div className="w-full bg-white border-b border-gray-100 py-10 lg:py-16 mb-8 lg:mb-12">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <p className="text-[9px] uppercase tracking-[0.4em] mb-4 font-medium text-gray-400">
                        My Account
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-[4rem] font-serif text-gray-900 font-light leading-none tracking-tight">
                        Account Dashboard.
                    </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative items-start">
                    
                    {/* Minimal Sidebar */}
                    <div className="w-full lg:w-[240px] flex-shrink-0 lg:sticky lg:top-36">
                        <div className="flex flex-col space-y-1">
                            <button
                                onClick={() => setActiveTab("personal")}
                                className={`flex items-center justify-between px-4 py-4 border-b transition-colors group ${activeTab === "personal"
                                    ? "border-black text-black"
                                    : "border-gray-200 text-gray-400 hover:text-black hover:border-black"
                                    }`}
                            >
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Personal Information</span>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === "personal" ? "translate-x-1" : "group-hover:translate-x-1"}`} strokeWidth={1} />
                            </button>

                            <button
                                onClick={() => setActiveTab("addresses")}
                                className={`flex items-center justify-between px-4 py-4 border-b transition-colors group ${activeTab === "addresses"
                                    ? "border-black text-black"
                                    : "border-gray-200 text-gray-400 hover:text-black hover:border-black"
                                    }`}
                            >
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Saved Addresses</span>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === "addresses" ? "translate-x-1" : "group-hover:translate-x-1"}`} strokeWidth={1} />
                            </button>
                            
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`flex items-center justify-between px-4 py-4 border-b transition-colors group ${activeTab === "orders"
                                    ? "border-black text-black"
                                    : "border-gray-200 text-gray-400 hover:text-black hover:border-black"
                                    }`}
                            >
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Order History</span>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === "orders" ? "translate-x-1" : "group-hover:translate-x-1"}`} strokeWidth={1} />
                            </button>

                            <button
                                onClick={() => setActiveTab("password")}
                                className={`flex items-center justify-between px-4 py-4 border-b transition-colors group ${activeTab === "password"
                                    ? "border-black text-black"
                                    : "border-gray-200 text-gray-400 hover:text-black hover:border-black"
                                    }`}
                            >
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Password & Security</span>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === "password" ? "translate-x-1" : "group-hover:translate-x-1"}`} strokeWidth={1} />
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-between px-4 py-4 mt-8 transition-colors group text-gray-400 hover:text-red-600"
                            >
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Sign Out</span>
                                <LogOut className="w-3.5 h-3.5" strokeWidth={1} />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 w-full bg-white border border-gray-100 p-8 lg:p-12">
                        
                        {activeTab === "personal" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                <h2 className="text-2xl font-serif text-gray-900 mb-8 font-light">Contact Details.</h2>
                                
                                <form className="space-y-8 max-w-xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">First Name</label>
                                            <input type="text" defaultValue="Aura" className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Last Name</label>
                                            <input type="text" defaultValue="Guest" className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Email Address</label>
                                        <input type="email" defaultValue="hello@akodfood.com" className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Phone Number</label>
                                        <input type="tel" defaultValue="+91 90000 00000" className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                    </div>
                                    
                                    <div className="pt-4">
                                        <button type="button" className="bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light py-4 px-10 hover:bg-brand-primary transition-colors">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                <div className="flex justify-between items-end mb-8">
                                    <h2 className="text-2xl font-serif text-gray-900 font-light">Saved Addresses.</h2>
                                    <button className="text-[9px] uppercase tracking-[0.3em] border-b border-black text-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                                        + Add New Address
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Default Address */}
                                    <div className="border border-black p-8 relative">
                                        <span className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-[9px] uppercase tracking-widest">Primary</span>
                                        <div className="flex items-start gap-4">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                                            <div>
                                                <h3 className="text-[9px] uppercase tracking-widest font-medium text-gray-900 mb-2">Home</h3>
                                                <p className="text-xs font-light text-gray-500 leading-relaxed max-w-[200px]">
                                                    1A Luxury Avenue,<br />
                                                    Bandra West,<br />
                                                    Mumbai, MH 400050<br />
                                                    India
                                                </p>
                                                <div className="flex gap-4 mt-6">
                                                    <button className="text-[9px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors">Edit</button>
                                                    <button className="text-[9px] uppercase tracking-[0.3em] text-gray-400 hover:text-red-500 transition-colors">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary Address */}
                                    <div className="border border-gray-100 bg-[#faf9f6] p-8">
                                        <div className="flex items-start gap-4">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                                            <div>
                                                <h3 className="text-[9px] uppercase tracking-widest font-medium text-gray-900 mb-2">Office</h3>
                                                <p className="text-xs font-light text-gray-500 leading-relaxed max-w-[200px]">
                                                    Corporate Tower B,<br />
                                                    Bandra Kurla Complex,<br />
                                                    Mumbai, MH 400051<br />
                                                    India
                                                </p>
                                                <div className="flex gap-4 mt-6">
                                                    <button className="text-[9px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors">Edit</button>
                                                    <button className="text-[9px] uppercase tracking-[0.3em] text-gray-400 hover:text-red-500 transition-colors">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                <h2 className="text-2xl font-serif text-gray-900 mb-8 font-light">Order History.</h2>
                                
                                <div className="space-y-12">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="border border-gray-100 bg-[#faf9f6] p-6 lg:p-8 relative group">
                                            
                                            <div className="flex flex-wrap justify-between items-end border-b border-gray-200 pb-6 mb-6 gap-6">
                                                <div>
                                                    <p className="text-sm text-gray-400 uppercase tracking-[0.3em] mb-2">Order Date</p>
                                                    <p className="font-serif text-lg text-gray-900 font-light">October 12, 2024</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400 uppercase tracking-[0.3em] mb-2">Total Amount</p>
                                                    <p className="font-light text-gray-900">₹2,490</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400 uppercase tracking-[0.3em] mb-2">Order Number</p>
                                                    <p className="font-light text-gray-900 font-mono text-sm">AKOD-00{Math.floor(Math.random() * 10000)}</p>
                                                </div>
                                                <div>
                                                    <span className="border border-black text-black px-4 py-2 text-[9px] uppercase tracking-[0.3em]">
                                                        Delivered
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-28 bg-white border border-gray-200 flex-shrink-0 overflow-hidden relative">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src="https://images.unsplash.com/photo-1566478989037-eadeea0a71f0?q=80&w=200&auto=format&fit=crop" alt="Item" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" />
                                                </div>
                                                <div>
                                                    <p className="font-serif text-xl font-light text-gray-900 mb-2">Signature Truffle Collection</p>
                                                    <p className="text-base text-gray-500 uppercase tracking-widest">Quantity: 2 &nbsp;|&nbsp; Weight: 500g</p>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "password" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                <h2 className="text-2xl font-serif text-gray-900 mb-8 font-light">Change Password.</h2>
                                
                                <form className="space-y-8 max-w-lg">
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                    </div>
                                    <div className="pt-4">
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Confirm New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                    </div>
                                    
                                    <div className="pt-4">
                                        <button type="button" className="bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light py-4 px-10 hover:bg-brand-primary transition-colors">
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
