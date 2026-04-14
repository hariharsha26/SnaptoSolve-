import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, X, Image as ImageIcon, Zap, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NeuButton } from "@/src/components/NeuButton";
import { cn } from "@/src/lib/utils";

const SnapCapture = () => {
  const navigate = useNavigate();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isGPSLocked, setIsGPSLocked] = useState(false);
  const [shutterEffect, setShutterEffect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate GPS lock
  React.useEffect(() => {
    const timer = setTimeout(() => setIsGPSLocked(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCapture = () => {
    setShutterEffect(true);
    setTimeout(() => {
      setShutterEffect(false);
      // In a real app, we'd take a photo. Here we'll just navigate to submit with a mock image.
      navigate("/submit", { state: { image: "https://picsum.photos/seed/civic/800/600" } });
    }, 200);
  };

  const handleGalleryPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        navigate("/submit", { state: { image: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col">
      {/* Camera Viewport Simulation */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gray-900">
        <img 
          src="https://picsum.photos/seed/street/800/1200" 
          alt="Camera View" 
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* Shutter Flash */}
        <AnimatePresence>
          {shutterEffect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-10"
            />
          )}
        </AnimatePresence>

        {/* UI Overlays */}
        <div className="absolute top-8 left-6">
          <button 
            onClick={() => navigate("/")}
            className="w-10 h-10 glass rounded-full flex items-center justify-center text-white"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <AnimatePresence>
          {isGPSLocked && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 bg-success/20 backdrop-blur-md border border-success/30 px-4 py-1.5 rounded-full flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Location locked ✓</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Lines Overlay */}
        <div className="absolute inset-0 pointer-events-none border-x border-white/10 flex justify-around">
          <div className="w-px h-full bg-white/10" />
          <div className="w-px h-full bg-white/10" />
        </div>
        <div className="absolute inset-0 pointer-events-none border-y border-white/10 flex flex-col justify-around">
          <div className="h-px w-full bg-white/10" />
          <div className="h-px w-full bg-white/10" />
        </div>
      </div>

      {/* Bottom Dock */}
      <div className="h-48 glass rounded-t-[40px] border-t border-white/20 flex items-center justify-around px-8">
        <NeuButton 
          variant="secondary" 
          className="w-12 h-12 rounded-full glass border-white/10"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={20} className="text-white" />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleGalleryPick}
          />
        </NeuButton>

        <button 
          onClick={handleCapture}
          className="w-20 h-20 rounded-full border-4 border-white/30 p-1 flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full bg-primary-gradient neu-float flex items-center justify-center">
            <Camera size={32} className="text-white" />
          </div>
        </button>

        <NeuButton 
          variant="secondary" 
          className={cn(
            "w-12 h-12 rounded-full glass border-white/10 transition-colors",
            isFlashOn ? "bg-yellow-500/20 text-yellow-500" : "text-white"
          )}
          onClick={() => setIsFlashOn(!isFlashOn)}
        >
          <Zap size={20} fill={isFlashOn ? "currentColor" : "none"} />
        </NeuButton>
      </div>
    </div>
  );
};

export default SnapCapture;
