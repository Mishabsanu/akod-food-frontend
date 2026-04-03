"use client";

import { X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthStep = 
    | "IDENTITY" 
    | "VERIFY_OTP_SIGNUP" 
    | "USER_DETAILS" 
    | "LOGIN_METHOD" 
    | "VERIFY_OTP_LOGIN" 
    | "PASSWORD_LOGIN";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter();
    const [step, setStep] = useState<AuthStep>("IDENTITY");
    const [identity, setIdentity] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [details, setDetails] = useState({ firstName: "", lastName: "", email: "" });
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep("IDENTITY");
            setIdentity("");
            setOtp("");
            setPassword("");
            setDetails({ firstName: "", lastName: "", email: "" });
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    const simulateLoading = (nextStep: AuthStep | "COMPLETE") => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (nextStep === "COMPLETE") {
                onClose();
                router.push("/"); // Redirect home as requested
            } else {
                setStep(nextStep);
            }
        }, 800);
    };

    const handleIdentitySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Dummy logic: if identity is exactly "9999999999" or has "@", treat as existing user. Else, new user.
        if (identity.includes("@")) {
            simulateLoading("LOGIN_METHOD");
        } else if (identity === "9999999999") {
            simulateLoading("VERIFY_OTP_LOGIN");
        } else {
            simulateLoading("VERIFY_OTP_SIGNUP");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-md mx-4 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-black/10">
                {/* Header */}
                <div className="flex justify-end p-6 absolute top-0 right-0 w-full z-10">
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50">
                        <X strokeWidth={1} className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-10 pt-16">
                    <h2 className="text-3xl font-serif text-gray-900 font-light mb-2">The Atelier.</h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-10">
                        Authenticate to access exclusive provisions
                    </p>

                    {/* Step 1: Identity */}
                    {step === "IDENTITY" && (
                        <form onSubmit={handleIdentitySubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] font-medium text-gray-500 mb-4">Mobile Number or Email</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Enter your credential"
                                    value={identity}
                                    onChange={(e) => setIdentity(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-black py-3 text-sm font-light text-gray-900 outline-none transition-colors"
                                />
                                <p className="text-[10px] text-gray-400 font-light mt-3">
                                    A verification code may be sent to you.
                                </p>
                            </div>
                            <button 
                                type="submit" 
                                disabled={!identity || isLoading}
                                className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Processing..." : "Continue"}
                            </button>
                        </form>
                    )}

                    {/* Step 2A: Verify OTP for Signup */}
                    {step === "VERIFY_OTP_SIGNUP" && (
                        <form onSubmit={(e) => { e.preventDefault(); simulateLoading("USER_DETAILS"); }} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] font-medium text-gray-500 mb-4">Verification Required</label>
                                <p className="text-[10px] text-gray-500 font-light mb-6">Enter the 6-digit code sent to <span className="font-medium text-black">{identity}</span></p>
                                <input 
                                    required
                                    type="text" 
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-black py-3 text-2xl tracking-[0.5em] text-center font-light text-gray-900 outline-none transition-colors"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={otp.length < 4 || isLoading}
                                className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Verifying..." : "Verify Identity"}
                            </button>
                        </form>
                    )}

                    {/* Step 2B: Collect User Details after Signup OTP */}
                    {step === "USER_DETAILS" && (
                        <form onSubmit={(e) => { e.preventDefault(); simulateLoading("COMPLETE"); }} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] font-medium text-gray-500 mb-4">Complete Profile</label>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input required type="text" placeholder="First Name" value={details.firstName} onChange={e => setDetails({...details, firstName: e.target.value})} className="w-full bg-transparent border-b border-gray-300 focus:border-black py-3 text-sm font-light outline-none transition-colors" />
                                    <input required type="text" placeholder="Last Name" value={details.lastName} onChange={e => setDetails({...details, lastName: e.target.value})} className="w-full bg-transparent border-b border-gray-300 focus:border-black py-3 text-sm font-light outline-none transition-colors" />
                                </div>
                                <input type="email" placeholder="Email Address (Optional)" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} className="w-full bg-transparent border-b border-gray-300 focus:border-black py-3 text-sm font-light outline-none transition-colors mb-4" />
                            </div>
                            <button 
                                type="submit" 
                                disabled={!details.firstName || isLoading}
                                className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Creating Dossier..." : "Finalize"}
                            </button>
                        </form>
                    )}

                    {/* Step 3A: Existing User Email -> Choose Password or OTP */}
                    {step === "LOGIN_METHOD" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] font-medium text-gray-500 mb-4">Welcome Back</label>
                                <p className="text-xs text-gray-500 font-light mb-8">How would you like to authenticate <span className="font-medium text-black">{identity}</span>?</p>
                            </div>
                            <div className="space-y-4">
                                <button onClick={() => setStep("PASSWORD_LOGIN")} className="w-full border border-gray-200 py-4 text-[10px] uppercase tracking-[0.3em] hover:border-black hover:bg-black hover:text-white transition-colors flex justify-between px-6 items-center">
                                    <span>Use Password</span> <ArrowRight className="w-4 h-4 text-gray-400" />
                                </button>
                                <button onClick={() => simulateLoading("VERIFY_OTP_LOGIN")} className="w-full border border-gray-200 py-4 text-[10px] uppercase tracking-[0.3em] hover:border-black hover:bg-black hover:text-white transition-colors flex justify-between px-6 items-center">
                                    <span>Get verification link</span> <ArrowRight className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3B: Existing User OTP Login */}
                    {step === "VERIFY_OTP_LOGIN" && (
                        <form onSubmit={(e) => { e.preventDefault(); simulateLoading("COMPLETE"); }} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] font-medium text-gray-500 mb-4">Verification</label>
                                <p className="text-[10px] text-gray-500 font-light mb-6">Enter the code sent to <span className="font-medium text-black">{identity}</span></p>
                                <input 
                                    required
                                    type="text" 
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-black py-3 text-2xl tracking-[0.5em] text-center font-light text-gray-900 outline-none transition-colors"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={otp.length < 4 || isLoading}
                                className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Authenticating..." : "Authenticate"}
                            </button>
                        </form>
                    )}

                    {/* Step 3C: Existing User Password Login */}
                    {step === "PASSWORD_LOGIN" && (
                        <form onSubmit={(e) => { e.preventDefault(); simulateLoading("COMPLETE"); }} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] font-medium text-gray-500 mb-4">Authentication</label>
                                <input 
                                    required
                                    type="password" 
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-black py-3 text-sm font-light text-gray-900 outline-none transition-colors"
                                />
                                <button type="button" className="text-[9px] text-gray-400 hover:text-black uppercase tracking-[0.1em] mt-4 block text-right w-full transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                            <button 
                                type="submit" 
                                disabled={!password || isLoading}
                                className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-brand-primary transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Authenticating..." : "Sign In"}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}
