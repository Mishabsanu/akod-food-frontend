"use client";

import { useState } from "react";
import { User, Package, Lock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type Tab = "personal" | "orders" | "password";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<Tab>("personal");
    const router = useRouter();

    const handleLogout = () => {
        // dummy logout
        router.push("/");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-serif text-brand-text mb-12">My Account</h1>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => setActiveTab("personal")}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === "personal"
                                ? "bg-brand-primary text-white font-medium"
                                : "text-gray-600 hover:bg-brand-bgAccent hover:text-brand-text"
                                }`}
                        >
                            <User className="w-5 h-5 mr-3" /> Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === "orders"
                                ? "bg-brand-primary text-white font-medium"
                                : "text-gray-600 hover:bg-brand-bgAccent hover:text-brand-text"
                                }`}
                        >
                            <Package className="w-5 h-5 mr-3" /> Order History
                        </button>
                        <button
                            onClick={() => setActiveTab("password")}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === "password"
                                ? "bg-brand-primary text-white font-medium"
                                : "text-gray-600 hover:bg-brand-bgAccent hover:text-brand-text"
                                }`}
                        >
                            <Lock className="w-5 h-5 mr-3" /> Change Password
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all mt-4"
                        >
                            <LogOut className="w-5 h-5 mr-3" /> Logout
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
                    {activeTab === "personal" && (
                        <div className="animate-slide-down">
                            <h2 className="text-2xl font-serif text-brand-text mb-6 border-b border-gray-100 pb-4">Personal Information</h2>
                            <form className="space-y-6 max-w-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input type="text" defaultValue="Aura" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input type="text" defaultValue="Guest" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" defaultValue="guest@akodfood.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input type="tel" defaultValue="+91 90000 00000" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                                </div>
                                <button type="button" className="bg-brand-text text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-brand-primary transition-colors">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div className="animate-slide-down">
                            <h2 className="text-2xl font-serif text-brand-text mb-6 border-b border-gray-100 pb-4">Order History</h2>
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                                        <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                                                <p className="font-medium text-brand-text">12 Oct 2024</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                                                <p className="font-medium text-brand-text">₹2,490</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order #</p>
                                                <p className="font-medium text-brand-text">ORD-{Math.floor(Math.random() * 10000)}</p>
                                            </div>
                                            <div>
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    Delivered
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-brand-bgAccent rounded-lg overflow-hidden flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src="https://images.unsplash.com/photo-1566478989037-eadeea0a71f0?q=80&w=150&auto=format&fit=crop" alt="Item" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-brand-text">Classic Salted Truffle Chips</p>
                                                <p className="text-sm text-gray-500 mt-1">Qty: 2  |  Pack: 500g</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "password" && (
                        <div className="animate-slide-down">
                            <h2 className="text-2xl font-serif text-brand-text mb-6 border-b border-gray-100 pb-4">Change Password</h2>
                            <form className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                                </div>
                                <button type="button" className="bg-brand-text text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-brand-primary transition-colors">
                                    Update Password
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
