"use client";

import { useAuth } from "@/context/AuthContext";
import { customerApi } from "@/lib/api";
import { ChevronRight, Loader2, LogOut, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Tab = "personal" | "addresses" | "orders" | "security";

export default function ProfilePage() {
    const { user, logout, login } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("personal");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });

    // Address State
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<any>({
        type: "Home",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        isDefault: false
    });

    // Orders State
    const [orders, setOrders] = useState<any[]>([]);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || user.name?.split(' ')[0] || "",
                lastName: user.lastName || user.name?.split(' ')[1] || "",
                email: user.email || "",
                phone: user.phone || ""
            });
            fetchAddresses();
            fetchOrders();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await customerApi.getProfile();
            setAddresses(res.data.data.addresses || []);
        } catch (error) {
            console.error("Failed to fetch addresses");
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await customerApi.getMyOrders();
            setOrders(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch orders");
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await customerApi.updateProfile(profileData)
            toast.success("Profile updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            const freshRes = await customerApi.getProfile();
            login(localStorage.getItem('akodUserToken') || "", freshRes.data.data);
            setIsLoading(false);
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (currentAddress._id) {
                await customerApi.updateAddress(currentAddress._id, currentAddress);
                toast.success("Address updated");
            } else {
                await customerApi.addAddress(currentAddress);
                toast.success("New address added");
            }
            setIsEditingAddress(false);
            fetchAddresses();
            setCurrentAddress({ type: "Home", street: "", city: "", state: "", zipCode: "", country: "India", isDefault: false });
        } catch (error) {
            toast.error("Failed to save address");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Delete this address?")) return;
        try {
            await customerApi.deleteAddress(id);
            toast.success("Address removed");
            fetchAddresses();
        } catch (error) {
            toast.error("Failed to remove address");
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await customerApi.setDefaultAddress(id);
            toast.success("Primary address updated");
            fetchAddresses();
        } catch (error) {
            toast.error("Failed to set primary address");
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        setIsLoading(true);
        try {
            await customerApi.changePassword({
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password changed successfully");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#faf9f6] min-h-screen pb-32 font-sans selection:bg-brand-primary/20 selection:text-black">

            {/* Ultra-Premium Header */}
            <div className="w-full bg-white border-b border-gray-100 py-10 lg:py-16 mb-8 lg:mb-12">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <p className="text-[9px] uppercase tracking-[0.4em] mb-4 font-medium text-gray-400">
                        My Account
                    </p>
                    <h1 className="text-3xl md:text-5xl font-serif text-gray-900 font-light leading-none tracking-tight">
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
                                onClick={() => setActiveTab("security")}
                                className={`flex items-center justify-between px-4 py-4 border-b transition-colors group ${activeTab === "security"
                                    ? "border-black text-black"
                                    : "border-gray-200 text-gray-400 hover:text-black hover:border-black"
                                    }`}
                            >
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Security & Identity</span>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === "security" ? "translate-x-1" : "group-hover:translate-x-1"}`} strokeWidth={1} />
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
                    <div className="flex-1 w-full bg-white border border-gray-100 p-8 lg:p-12 min-h-[500px]">

                        {activeTab === "personal" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                <h2 className="text-2xl font-serif text-gray-900 mb-8 font-light">Contact Details.</h2>

                                <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">First Name</label>
                                            <input required type="text" value={profileData.firstName} onChange={e => setProfileData({ ...profileData, firstName: e.target.value })} className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Last Name</label>
                                            <input required type="text" value={profileData.lastName} onChange={e => setProfileData({ ...profileData, lastName: e.target.value })} className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Email Address</label>
                                        <input required type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Phone Number</label>
                                        <input required type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" />
                                    </div>

                                    <div className="pt-4">
                                        <button disabled={isLoading} type="submit" className="bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light py-4 px-10 hover:bg-brand-primary transition-colors flex items-center gap-3">
                                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                <div className="flex justify-between items-end mb-8">
                                    <h2 className="text-2xl font-serif text-gray-900 font-light">Saved Addresses.</h2>
                                    {!isEditingAddress && (
                                        <button onClick={() => { setIsEditingAddress(true); setCurrentAddress({ type: "Home", street: "", city: "", state: "", zipCode: "", country: "India", isDefault: false }); }} className="text-[9px] uppercase tracking-[0.3em] border-b border-black text-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                                            + Add New Address
                                        </button>
                                    )}
                                </div>

                                {isEditingAddress ? (
                                    <form onSubmit={handleSaveAddress} className="space-y-8 max-w-xl animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Address Type</label>
                                                <select value={currentAddress.type} onChange={e => setCurrentAddress({ ...currentAddress, type: e.target.value })} className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors appearance-none cursor-pointer">
                                                    <option value="Home">Home</option>
                                                    <option value="Office">Office</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Pincode / Zip Code</label>
                                                <input required type="text" value={currentAddress.zipCode} onChange={e => setCurrentAddress({ ...currentAddress, zipCode: e.target.value })} className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" placeholder="000000" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Street Address / Landmark</label>
                                            <input required type="text" value={currentAddress.street} onChange={e => setCurrentAddress({ ...currentAddress, street: e.target.value })} className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" placeholder="Building name, Street, Landmark" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">City</label>
                                                <input required type="text" value={currentAddress.city} onChange={e => setCurrentAddress({ ...currentAddress, city: e.target.value })} className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" placeholder="City" />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">State</label>
                                                <input required type="text" value={currentAddress.state} onChange={e => setCurrentAddress({ ...currentAddress, state: e.target.value })} className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" placeholder="State" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            <input type="checkbox" id="isDefault" checked={currentAddress.isDefault} onChange={e => setCurrentAddress({ ...currentAddress, isDefault: e.target.checked })} className="w-4 h-4 accent-black" />
                                            <label htmlFor="isDefault" className="text-[10px] uppercase tracking-widest text-gray-500 cursor-pointer">Set as primary delivery address</label>
                                        </div>
                                        <div className="flex gap-6 pt-6">
                                            <button disabled={isLoading} type="submit" className="bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light py-4 px-10 hover:bg-brand-primary transition-colors flex items-center gap-3">
                                                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save Address"}
                                            </button>
                                            <button type="button" onClick={() => setIsEditingAddress(false)} className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black py-4 px-6 transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {addresses.map((addr) => (
                                            <div key={addr._id} className={`p-8 relative transition-all duration-300 group hover:border-black ${addr.isDefault ? 'border border-black bg-white shadow-sm' : 'border border-gray-100 bg-[#faf9f6]'}`}>
                                                {addr.isDefault && <span className="absolute top-0 right-0 bg-black text-white px-4 py-1.5 text-[8px] uppercase tracking-[0.3em] font-medium">Primary node</span>}
                                                <div className="flex items-start gap-5">
                                                    <div className={`p-3 rounded-full ${addr.isDefault ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                                        <MapPin className="w-4 h-4" strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-900 mb-3">{addr.type || "Default"}</h3>
                                                        <p className="text-xs font-light text-gray-500 leading-loose mb-6">
                                                            {addr.street},<br />
                                                            {addr.city}, {addr.state} {addr.zipCode}<br />
                                                            {addr.country}
                                                        </p>
                                                        <div className="flex gap-6 pt-4 border-t border-gray-100/50">
                                                            <button onClick={() => { setCurrentAddress(addr); setIsEditingAddress(true); }} className="text-[9px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors">Modify</button>
                                                            <button onClick={() => handleDeleteAddress(addr._id)} className="text-[9px] uppercase tracking-[0.3em] text-gray-400 hover:text-red-500 transition-colors">Remove</button>
                                                            {!addr.isDefault && (
                                                                <button onClick={() => handleSetDefault(addr._id)} className="text-[9px] uppercase tracking-[0.3em] text-brand-primary font-bold hover:underline underline-offset-4 transition-all ml-auto">Primary</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {addresses.length === 0 && (
                                            <div className="col-span-2 py-24 text-center border border-dashed border-gray-200 rounded-lg group">
                                                <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-4 group-hover:text-gray-300 transition-colors" strokeWidth={1} />
                                                <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em]">No delivery nodes registered</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                <h2 className="text-2xl font-serif text-gray-900 mb-8 font-light">Order History.</h2>

                                <div className="space-y-12">
                                    {orders.length === 0 && <div className="py-20 text-center border border-dashed border-gray-100 uppercase tracking-widest text-gray-300 text-xs">Purchase ledger is empty</div>}
                                    {orders.map((order) => (
                                        <div key={order._id} className="border border-gray-100 bg-[#faf9f6] p-6 lg:p-8 relative group">

                                            <div className="flex flex-wrap justify-between items-end border-b border-gray-200 pb-6 mb-6 gap-6">
                                                <div>
                                                    <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] mb-2">Order Date</p>
                                                    <p className="font-serif text-base text-gray-900 font-light">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] mb-2">Investment Value</p>
                                                    <p className="font-light text-gray-900">₹{order.totalAmount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] mb-2">Ticket Node</p>
                                                    <p className="font-light text-gray-900 font-mono text-xs uppercase">#AKD-{order._id.slice(-8)}</p>
                                                </div>
                                                <div>
                                                    <Link href={`/orders/${order._id}`} className="border border-black text-black px-4 py-2 text-[9px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all inline-flex items-center gap-2">
                                                        {order.status} <ChevronRight size={10} />
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {order.items?.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-6">
                                                        <div className="w-16 h-20 bg-white border border-gray-200 flex-shrink-0 overflow-hidden relative p-1">
                                                            <img src={item.product?.images?.[0] || "/placeholder.png"} alt={item.product?.name} className="w-full h-full object-contain mix-blend-multiply opacity-80" />
                                                        </div>
                                                        <div>
                                                            <p className="font-serif text-lg font-light text-gray-900 mb-1">{item.product?.name}</p>
                                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Qty: {item.quantity} &nbsp;|&nbsp; Price: ₹{item.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                <h2 className="text-2xl font-serif text-gray-900 mb-4 font-light">Security & Identity.</h2>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-12">Manage your verified contact methods</p>

                                <div className="space-y-12 max-w-xl">
                                    {/* Email Section */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-gray-50/50 border border-gray-100">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">Primary Email</p>
                                            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                                        </div>
                                        <button 
                                            onClick={() => toast.info("Email update with OTP coming soon")}
                                            className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-primary border-b border-brand-primary pb-0.5 self-start md:self-center"
                                        >
                                            Update Email
                                        </button>
                                    </div>

                                    {/* Phone Section */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-gray-50/50 border border-gray-100">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">Verified Mobile</p>
                                            <p className="text-sm font-medium text-gray-900">{user?.phone}</p>
                                        </div>
                                        <button 
                                            onClick={() => toast.info("Phone update with OTP coming soon")}
                                            className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-primary border-b border-brand-primary pb-0.5 self-start md:self-center"
                                        >
                                            Update Mobile
                                        </button>
                                    </div>

                                    <div className="pt-8 border-t border-gray-100">
                                        <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                            "For your security, changing your primary contact information requires verification via a one-time security key sent to your new destination."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
