"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Loader2, Mail, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { customerApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AuthStep = "OFFER" | "IDENTITY" | "OTP" | "DETAILS" | "SUCCESS";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>("OFFER");
  const [identity, setIdentity] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen) return null;

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      await customerApi.sendOTP(identity);
      setStep("OTP");
      setTimer(60); // 60 seconds countdown
      toast.success(`Code sent to ${identity}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      try {
        const res = await customerApi.login({ identity, otp });
        authLogin(res.data.data.accessToken, res.data.data.customer);
        setStep("SUCCESS");
        setTimeout(() => {
          onClose();
          router.push("/");
        }, 2000);
      } catch (loginErr: any) {
        if (loginErr.response?.status === 404 || loginErr.response?.data?.message?.includes('not found')) {
          if (identity.includes('@')) {
            setEmail(identity);
            setPhone("");
          } else {
            setPhone(identity);
            setEmail("");
          }
          setStep("DETAILS");
        } else {
          throw loginErr;
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await customerApi.register({ firstName, lastName, email, phone, otp });
      authLogin(res.data.data.accessToken, res.data.data.customer);
      setStep("SUCCESS");
      setTimeout(() => {
        onClose();
        router.push("/");
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white w-full max-w-[750px] h-[480px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-700 flex flex-col md:flex-row">

        <div className="hidden md:block relative w-[38%] bg-gray-900 overflow-hidden">
          <Image
            src="/hero-2.png"
            alt="AKOD Luxury"
            fill
            className="absolute inset-0 w-full h-full object-cover opacity-80 scale-110 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-[8px] tracking-[0.5em] text-white/60 uppercase">The Art of Dining</p>
              <h2 className="text-2xl font-serif text-white leading-tight font-light italic">AKOD FOOD.</h2>
            </div>
            <div className="space-y-3">
              <p className="text-[9px] text-white/50 leading-loose tracking-widest uppercase italic">
                &quot;Excellence is not an act, but a habit.&quot;
              </p>
              <div className="h-[1px] w-8 bg-brand-primary" />
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="flex-1 bg-white p-8 sm:p-10 flex flex-col relative">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-gray-300 hover:text-black transition-colors"
          >
            <X size={20} strokeWidth={1} />
          </button>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">

            {step === "OFFER" && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="space-y-6 mb-12">
                  <h3 className="text-4xl font-serif text-gray-900 font-light leading-snug">
                    Unlock Exclusive <br />
                    <span className="italic text-brand-primary">Culinary Access.</span>
                  </h3>
                  <p className="text-[11px] tracking-widest text-gray-400 uppercase leading-relaxed">
                    Join our members-only circle for priority reservations and chef-curated seasonal offers.
                  </p>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => setStep("IDENTITY")}
                    className="w-full bg-black text-white py-6 text-[10px] tracking-[0.5em] uppercase hover:bg-brand-primary transition-all duration-500 flex items-center justify-center gap-4 group"
                  >
                    ENTER THE CIRCLE <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-4 text-[9px] tracking-[0.3em] text-gray-300 hover:text-black transition-colors uppercase"
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>
            )}

            {step === "IDENTITY" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="mb-12 text-center md:text-left">
                  <div className="w-10 h-10 bg-brand-primary/5 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                    <ShieldCheck size={20} className="text-brand-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-serif text-gray-900 font-light mb-4 italic">Join or Sign In.</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 leading-relaxed">
                    Enter your mobile to access your <br className="hidden md:block" /> private AKOD collection.
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-12">
                  <div className="relative group">
                    <div className="absolute -left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                      {identity.includes('@') ? <Mail size={16} strokeWidth={1} /> : <Phone size={16} strokeWidth={1} />}
                    </div>
                    <input
                      required
                      autoFocus
                      type="text"
                      placeholder="EMAIL"
                      value={identity}
                      onChange={(e) => setIdentity(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-100 focus:border-black py-4 pl-8 text-[11px] tracking-[0.4em] outline-none uppercase transition-all placeholder:text-gray-200"
                    />
                  </div>

                  <div className="space-y-6">
                    <button
                      type="submit"
                      disabled={isLoading || !identity}
                      className="w-full bg-black text-white py-6 text-[10px] tracking-[0.5em] uppercase hover:bg-brand-primary transition-all duration-500 flex items-center justify-center gap-4"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Request Secure Key <ArrowRight size={14} /></>}
                    </button>
                    <button type="button" onClick={() => setStep("OFFER")} className="w-full text-[9px] tracking-[0.3em] text-gray-300 hover:text-black uppercase text-center">← Back to Overview</button>
                  </div>

                  <div className="pt-12 flex items-center justify-center gap-3 opacity-30 grayscale group">
                    <ShieldCheck size={12} />
                    <span className="text-[8px] tracking-[0.3em] uppercase">Secure 256-bit Encryption</span>
                  </div>
                </form>
              </div>
            )}

            {step === "OTP" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-700 text-center">
                <div className="mb-12 text-left">
                  <h3 className="text-3xl font-serif text-gray-900 font-light mb-4 italic">Verification.</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 leading-relaxed">
                    A 6-digit key has been dispatched to <span className="text-black font-medium">{identity}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-12">
                  <input
                    required
                    autoFocus
                    maxLength={6}
                    type="text"
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-transparent border-b border-gray-100 focus:border-brand-primary py-6 text-center text-3xl font-light tracking-[0.8em] outline-none transition-all placeholder:opacity-20"
                  />

                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 6}
                    className="w-full bg-black text-white py-6 text-[10px] tracking-[0.5em] uppercase hover:bg-brand-primary transition-all duration-500 flex items-center justify-center gap-4"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Authorize <ShieldCheck size={16} /></>}
                  </button>

                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      disabled={timer > 0 || isLoading}
                      onClick={handleSendOTP}
                      className={`text-[9px] tracking-[0.3em] uppercase transition-colors ${timer > 0 ? 'text-gray-300' : 'text-brand-primary font-bold hover:text-black'}`}
                    >
                      {timer > 0 ? `Resend Key in ${timer}s` : "Resend Security Key"}
                    </button>
                    <button type="button" onClick={() => setStep("IDENTITY")} className="text-[9px] tracking-[0.3em] text-gray-300 hover:text-black uppercase">Change Identity</button>
                  </div>
                </form>
              </div>
            )}

            {step === "DETAILS" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="mb-10">
                  <h3 className="text-3xl font-serif text-gray-900 font-light mb-4 italic">Welcome.</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Complete your luxury profile to continue</p>
                </div>

                <form onSubmit={handleCompleteRegistration} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[8px] tracking-widest text-gray-400 uppercase">First Name</label>
                      <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-transparent border-b border-gray-100 focus:border-black py-2 text-[11px] tracking-widest outline-none uppercase" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] tracking-widest text-gray-400 uppercase">Last Name</label>
                      <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-transparent border-b border-gray-100 focus:border-black py-2 text-[11px] tracking-widest outline-none uppercase" />
                    </div>
                  </div>

                  {identity.includes('@') ? (
                    <div className="space-y-2">
                      <label className="text-[8px] tracking-widest text-gray-400 uppercase">Mobile Number</label>
                      <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-transparent border-b border-gray-100 focus:border-black py-3 text-[11px] tracking-widest outline-none uppercase" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[8px] tracking-widest text-gray-400 uppercase">Email Address</label>
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b border-gray-100 focus:border-black py-3 text-[11px] tracking-widest outline-none uppercase" />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-6 text-[10px] tracking-[0.5em] uppercase hover:bg-brand-primary transition-all mt-8"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "ESTABLISH MEMBERSHIP"}
                  </button>
                </form>
              </div>
            )}

            {step === "SUCCESS" && (
              <div className="animate-in fade-in zoom-in-95 duration-700 text-center py-12">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping" />
                  <CheckCircle2 size={80} className="text-brand-primary relative z-10" strokeWidth={1} />
                </div>
                <h3 className="text-4xl font-serif text-gray-900 font-light mb-4 italic">Verified.</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Welcome to the world of AKOD</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
