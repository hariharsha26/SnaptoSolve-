import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NeuCard } from "@/src/components/NeuCard";
import { NeuButton } from "@/src/components/NeuButton";
import { NeuInput } from "@/src/components/NeuInput";
import { Drop, Lightning, Warning, Trash, PawPrint, Fire, Plus, MapPin, Pencil, Check, CircleNotch } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { categorizeIssue } from "@/src/services/geminiService";
import { useStore } from "@/src/store/useStore";
import { db, collection, addDoc, handleFirestoreError, OperationType } from "@/src/services/firebase";
import { cn } from "@/src/lib/utils";
import { Skeleton } from "@/src/components/Skeleton";

const categories = [
  { id: "drainage", icon: Drop, label: "Drainage", color: "text-blue-500" },
  { id: "electrical", icon: Lightning, label: "Electrical", color: "text-yellow-500" },
  { id: "roads", icon: Warning, label: "Roads", color: "text-orange-500" },
  { id: "garbage", icon: Trash, label: "Garbage", color: "text-green-500" },
  { id: "animal", icon: PawPrint, label: "Animal", color: "text-purple-500" },
  { id: "fire", icon: Fire, label: "Fire", color: "text-red-500" },
  { id: "other", icon: Plus, label: "Other", color: "text-gray-500" },
];

const SubmissionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, addComplaint } = useStore();
  const capturedImage = location.state?.image || "https://picsum.photos/seed/civic/800/600";

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    priority: "Medium",
    location: "123 Civic Lane, Jubilee Hills, Hyderabad",
  });

  useEffect(() => {
    const analyze = async () => {
      // In a real app, we'd pass the base64 image
      // For demo, we'll simulate a delay and use mock AI results
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          title: "Leaking Drainage Pipe",
          category: "drainage",
          description: "Water is overflowing from the main line near the park entrance.",
          priority: "High"
        }));
        setIsAnalyzing(false);
      }, 2000);
    };
    analyze();
  }, []);

  const handleSubmit = async () => {
    if (user?.isAnonymous) {
      alert("You must be logged in to submit a complaint.");
      return;
    }
    
    setIsSubmitting(true);
    
    const newComplaint = {
      id: `CMP-${Date.now()}`,
      userId: user?.uid || "anonymous",
      ...formData,
      status: "pending" as const,
      imageUrl: capturedImage,
      timestamp: Date.now(),
      upvotes: 0,
      department: "Municipal Sanitation",
      slaDeadline: Date.now() + 48 * 60 * 60 * 1000,
      location: { lat: 17.3850, lng: 78.4867, address: formData.location }
    };

    try {
      const path = "complaints";
      await addDoc(collection(db, path), newComplaint);
      addComplaint(newComplaint);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
      }, 1500);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "complaints");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      {/* Image Preview */}
      <NeuCard className="bento-card h-56 overflow-hidden p-0">
        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
      </NeuCard>

      {/* AI Indicator */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-inset p-4 rounded-2xl border border-primary/20"
          >
            <CircleNotch className="animate-spin text-primary" size={20} weight="bold" />
            <span className="text-body-md font-semibold text-primary">AI is analyzing the issue...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-success/10 p-4 rounded-2xl border border-success/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Check className="text-success" size={20} weight="bold" />
            <span className="text-body-md font-semibold text-success">AI detected: Drainage issue</span>
          </div>
          <button className="text-[10px] font-bold text-success uppercase underline">Change</button>
        </motion.div>
      )}

      {/* Category Picker */}
      <div className="space-y-3">
        <label className="text-label-md font-bold text-text-secondary ml-2">Category</label>
        <div className="grid grid-cols-3 gap-4">
          {isAnalyzing ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-24 rounded-[24px]" />
            ))
          ) : (
            categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFormData({ ...formData, category: cat.id })}
                className="w-full"
              >
                <NeuCard 
                  variant={formData.category === cat.id ? "pressed" : "raised"}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 h-24 transition-all",
                    formData.category === cat.id && "bg-primary/5 ring-2 ring-primary/20"
                  )}
                >
                  <cat.icon size={28} weight={formData.category === cat.id ? "fill" : "regular"} className={formData.category === cat.id ? "text-primary" : "text-text-secondary"} />
                  <span className={cn(
                    "text-[10px] font-bold uppercase",
                    formData.category === cat.id ? "text-primary" : "text-text-secondary"
                  )}>
                    {cat.label}
                  </span>
                </NeuCard>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <NeuInput 
          label="Issue Title" 
          value={formData.title} 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Broken streetlight"
        />
        
        <div className="relative">
          <NeuInput 
            label="Location" 
            value={formData.location} 
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <MapPin size={18} weight="fill" className="absolute right-4 bottom-3.5 text-primary" />
        </div>

        <NeuInput 
          label="Description" 
          isTextArea 
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the problem in detail..."
        />
      </div>

      {/* Priority */}
      <div className="space-y-3">
        <label className="text-label-md font-bold text-text-secondary ml-2">Priority Level</label>
        <div className="flex gap-2">
          {["Low", "Medium", "High", "Urgent"].map((p) => {
            const isSelected = formData.priority === p;
            let colorClass = "border-inset text-text-secondary";
            if (isSelected) {
              if (p === "Low") colorClass = "bg-[#4CAF50] border-[#4CAF50] text-white shadow-md";
              else if (p === "Medium") colorClass = "bg-[#2196F3] border-[#2196F3] text-white shadow-md";
              else if (p === "High") colorClass = "bg-[#FFC107] border-[#FFC107] text-white shadow-md";
              else if (p === "Urgent") colorClass = "bg-error border-error text-white shadow-md";
            } else {
              colorClass = "border-inset text-text-secondary hover:bg-inset";
            }

            return (
              <button
                key={p}
                onClick={() => setFormData({ ...formData, priority: p })}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase rounded-full transition-all border",
                  colorClass
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <NeuButton 
        variant="primary" 
        size="xl" 
        className="w-full mt-8"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-3">
            <CircleNotch className="animate-spin" size={24} weight="bold" />
            <span>Routing to department...</span>
          </div>
        ) : "Submit Complaint"}
      </NeuButton>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-success flex items-end justify-center"
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-surface rounded-t-[40px] p-8 space-y-6 neu-raised"
            >
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <Check size={40} weight="bold" className="text-success" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-headline-sm font-bold">Complaint Submitted!</h2>
                <p className="text-body-md text-text-secondary">
                  Your report #CMP-2024-1847 has been successfully routed to the Municipal Sanitation department.
                </p>
              </div>
              <NeuButton 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={() => navigate("/")}
              >
                Back to Dashboard
              </NeuButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmissionForm;
