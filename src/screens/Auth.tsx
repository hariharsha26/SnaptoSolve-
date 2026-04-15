import React, { useState, useEffect } from "react";
import { NeuCard } from "@/src/components/NeuCard";
import { NeuButton } from "@/src/components/NeuButton";
import { NeuInput } from "@/src/components/NeuInput";
import { Camera, ShieldCheck, Globe, CaretRight, EnvelopeSimple, LockKey, User, Phone as PhoneIcon, Fingerprint } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { 
  auth, db, signInWithGoogle, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  sendEmailVerification, signInAnonymously, RecaptchaVerifier, signInWithPhoneNumber,
  setDoc, doc, serverTimestamp, handleFirestoreError, OperationType
} from "@/src/services/firebase";
import { useNavigate } from "react-router-dom";

type AuthMode = "login" | "signup" | "phone" | "otp" | "verify-email" | "forgot-password";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser && !auth.currentUser.emailVerified && auth.currentUser.email) {
      setMode("verify-email");
      setEmail(auth.currentUser.email);
    }
    
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  }, []);

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await signInWithGoogle();
      
      // Check if user doc exists, if not create it
      const userRef = doc(db, "users", user.uid);
      try {
        await setDoc(userRef, {
          fullName: user.displayName || "Citizen",
          email: user.email,
          phoneNumber: user.phoneNumber || null,
          profileImage: user.photoURL || "",
          role: "citizen",
          isEmailVerified: user.emailVerified,
          isPhoneVerified: !!user.phoneNumber,
          isSuspended: false,
          fcmTokens: [],
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          location: { latitude: 0, longitude: 0, address: "", city: "", state: "" },
          stats: { complaintsSubmitted: 0, complaintsResolved: 0, trustScore: 50 },
          settings: { notificationsEnabled: true, biometricEnabled: false, twoFactorEnabled: false }
        }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
      }
      
      // Session creation is handled in App.tsx or backend
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    setError("");
    if (!validatePassword(password)) {
      setError("Password must be at least 8 chars, 1 uppercase, 1 number");
      return;
    }
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName || "Citizen",
        email: user.email,
        phoneNumber: null,
        profileImage: "",
        role: "citizen",
        isEmailVerified: false,
        isPhoneVerified: false,
        isSuspended: false,
        fcmTokens: [],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        location: { latitude: 0, longitude: 0, address: "", city: "", state: "" },
        stats: { complaintsSubmitted: 0, complaintsResolved: 0, trustScore: 50 },
        settings: { notificationsEnabled: true, biometricEnabled: false, twoFactorEnabled: false }
      });

      await sendEmailVerification(user);
      setMode("verify-email");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setError("");
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setMode("verify-email");
      }
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      setIsLoading(true);
      await signInAnonymously(auth);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setError("");
    try {
      setIsLoading(true);
      const appVerifier = (window as any).recaptchaVerifier;
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setMode("otp");
    } catch (err: any) {
      setError(err.message);
      // Reset recaptcha
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          (window as any).grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    try {
      setIsLoading(true);
      const code = otp.join("");
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      
      await setDoc(doc(db, "users", user.uid), {
        fullName: "Citizen",
        email: "",
        phoneNumber: user.phoneNumber,
        profileImage: "",
        role: "citizen",
        isEmailVerified: false,
        isPhoneVerified: true,
        isSuspended: false,
        fcmTokens: [],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        location: { latitude: 0, longitude: 0, address: "", city: "", state: "" },
        stats: { complaintsSubmitted: 0, complaintsResolved: 0, trustScore: 50 },
        settings: { notificationsEnabled: true, biometricEnabled: false, twoFactorEnabled: false }
      }, { merge: true });

    } catch (err: any) {
      setError("Invalid OTP code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col justify-center space-y-8">
      <div id="recaptcha-container"></div>
      
      {/* Logo Section */}
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-[24px] bg-primary-gradient neu-float flex items-center justify-center text-white"
        >
          <Camera size={40} weight="fill" />
        </motion.div>
        <div className="text-center space-y-1">
          <h1 className="text-display-md font-bold text-primary">Snaptosolve</h1>
          <p className="text-body-md text-text-secondary font-medium">Report. Track. Resolve.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-error/10 border border-error/20 text-error text-label-md rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Auth Form */}
      <AnimatePresence mode="wait">
        {mode === "login" || mode === "signup" ? (
          <motion.div
            key="email-auth"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4"
          >
            {mode === "signup" && (
              <NeuInput 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User size={20} className="text-text-secondary" />}
              />
            )}
            <NeuInput 
              placeholder="Email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<EnvelopeSimple size={20} className="text-text-secondary" />}
            />
            <NeuInput 
              placeholder="Password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<LockKey size={20} className="text-text-secondary" />}
            />
            {mode === "signup" && (
              <div className="text-[10px] text-text-secondary px-2">
                Password must be at least 8 chars, 1 uppercase, 1 number
              </div>
            )}

            <NeuButton 
              variant="primary" 
              size="lg" 
              className="w-full"
              onClick={mode === "login" ? handleEmailLogin : handleEmailSignup}
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
            </NeuButton>

            <div className="flex justify-between items-center px-2">
              <button 
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-label-md font-bold text-primary"
              >
                {mode === "login" ? "Create an account" : "Already have an account?"}
              </button>
              {mode === "login" && (
                <button className="text-label-md text-text-secondary">Forgot Password?</button>
              )}
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-inset" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-text-secondary bg-canvas px-4">
                Or continue with
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <NeuButton variant="secondary" className="h-12 gap-2" onClick={handleGoogleSignIn}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                <span className="text-label-md font-bold">Google</span>
              </NeuButton>
              <NeuButton variant="secondary" className="h-12 gap-2" onClick={() => setMode("phone")}>
                <PhoneIcon size={18} weight="fill" className="text-primary" />
                <span className="text-label-md font-bold">Phone</span>
              </NeuButton>
            </div>
            
            <div className="pt-2">
              <NeuButton variant="ghost" className="w-full h-12 gap-2" onClick={handleAnonymousLogin}>
                <span className="text-label-md font-bold">Browse Anonymously</span>
              </NeuButton>
            </div>
          </motion.div>
        ) : mode === "phone" ? (
          <motion.div
            key="phone"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex gap-3">
                <NeuCard className="w-20 h-14 flex items-center justify-center text-title-lg font-bold border border-inset shadow-sm">
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
                disabled={phone.length < 10 || isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </NeuButton>
              <NeuButton variant="ghost" className="w-full" onClick={() => setMode("login")}>
                Back to Login
              </NeuButton>
            </div>
          </motion.div>
        ) : mode === "otp" ? (
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
                  className="w-12 h-14 bg-surface border border-inset shadow-sm rounded-xl text-center text-xl font-bold text-primary focus:outline-none focus:border-primary transition-all"
                />
              ))}
            </div>

            <div className="space-y-4">
              <NeuButton variant="primary" size="xl" className="w-full" onClick={handleVerifyOTP} disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify & Login"}
              </NeuButton>
              <button 
                onClick={() => setMode("phone")}
                className="w-full text-center text-label-md font-bold text-primary uppercase"
              >
                Change Phone Number
              </button>
            </div>
          </motion.div>
        ) : mode === "verify-email" ? (
          <motion.div
            key="verify-email"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6 text-center"
          >
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <EnvelopeSimple size={40} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-headline-sm font-bold">Verify your email</h3>
              <p className="text-body-md text-text-secondary">
                We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to continue.
              </p>
            </div>
            <div className="space-y-3 pt-4">
              <NeuButton variant="primary" className="w-full" onClick={() => window.location.reload()}>
                I've verified my email
              </NeuButton>
              <NeuButton variant="secondary" className="w-full" onClick={async () => {
                if (auth.currentUser) {
                  await sendEmailVerification(auth.currentUser);
                  alert("Verification email resent!");
                }
              }}>
                Resend Email
              </NeuButton>
              <NeuButton variant="ghost" className="w-full" onClick={() => setMode("login")}>
                Back to Login
              </NeuButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
