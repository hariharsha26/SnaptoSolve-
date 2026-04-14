import React, { useState } from "react";
import { NeuCard } from "@/src/components/NeuCard";
import { NeuButton } from "@/src/components/NeuButton";
import { NeuInput } from "@/src/components/NeuInput";
import { Camera, ShieldCheck, Globe, ChevronRight, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { signInWithGoogle } from "@/src/services/firebase";

const Auth = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      setStep("otp");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col justify-center space-y-12">
      {/* Logo Section */}
      <div className="flex flex-col items-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-[32px] bg-primary-gradient neu-float flex items-center justify-center text-white"
        >
          <Camera size={48} />
        </motion.div>
        <div className="text-center space-y-2">
          <h1 className="text-display-lg font-bold text-primary">Snaptosolve</h1>
          <p className="text-title-lg text-text-secondary font-medium">Report. Track. Resolve.</p>
        </div>
      </div>

      {/* Auth Form */}
      <AnimatePresence mode="wait">
        {step === "phone" ? (
          <motion.div
            key="phone"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex gap-3">
                <NeuCard className="w-20 h-14 flex items-center justify-center text-title-lg font-bold">
                  +91
                </NeuCard>
                <NeuInput 
                  placeholder="Phone number" 
                  className="h-14 text-lg" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                />
              </div>
              <NeuButton 
                variant="primary" 
                size="xl" 
                className="w-full"
                onClick={handleSendOTP}
                disabled={phone.length < 10}
              >
                Send OTP
              </NeuButton>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-text-secondary/10" />
              </div>
              <div className="relative flex justify-center text-label-md uppercase font-bold text-text-secondary bg-canvas px-4">
                Or continue with
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NeuButton 
                variant="secondary" 
                className="h-14 gap-3"
                onClick={() => signInWithGoogle()}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span className="text-label-md font-bold">Google</span>
              </NeuButton>
              <NeuButton variant="secondary" className="h-14 gap-3">
                <ShieldCheck size={20} className="text-primary" />
                <span className="text-label-md font-bold">Apple</span>
              </NeuButton>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-headline-sm font-bold">Verify Phone</h3>
              <p className="text-body-md text-text-secondary">Enter the 6-digit code sent to +91 {phone}</p>
            </div>

            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 bg-inset neu-pressed rounded-xl text-center text-xl font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              ))}
            </div>

            <div className="space-y-4">
              <NeuButton variant="primary" size="xl" className="w-full" onClick={() => signInWithGoogle()}>
                Verify & Login
              </NeuButton>
              <button 
                onClick={() => setStep("phone")}
                className="w-full text-center text-label-md font-bold text-primary uppercase"
              >
                Resend Code in 0:45
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selector */}
      <div className="fixed top-8 right-8">
        <NeuButton variant="secondary" className="h-10 px-4 gap-2 text-[10px] font-bold uppercase">
          <Globe size={14} />
          English
          <ChevronRight size={14} className="rotate-90" />
        </NeuButton>
      </div>
    </div>
  );
};

export default Auth;
