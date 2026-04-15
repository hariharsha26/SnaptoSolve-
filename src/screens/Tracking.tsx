import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/src/store/useStore";
import { NeuCard } from "@/src/components/NeuCard";
import { NeuButton } from "@/src/components/NeuButton";
import { ArrowLeft, Check, Clock, Warning, ShareNetwork, ChatCircle, Phone } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { Skeleton } from "@/src/components/Skeleton";

const Tracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, isLoading } = useStore();
  
  const complaint = complaints.find(c => c.id === id) || {
    id: "CMP-2024-1847",
    title: "Leaking Drainage Pipe",
    status: "in-progress",
    imageUrl: "https://picsum.photos/seed/drain/400/300",
    department: "Municipal Sanitation",
    assignedOfficer: "Officer Ramesh K.",
    timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4h ago
    slaDeadline: Date.now() + 1000 * 60 * 60 * 44, // 44h left
  };

  const steps = [
    { label: "Submitted", sub: "Complaint received", status: "completed", time: "10:30 AM" },
    { label: "Assigned", sub: "Municipal Sanitation", status: "completed", time: "11:15 AM" },
    { label: "In Progress", sub: "Officer Ramesh K.", status: "active", time: "12:45 PM" },
    { label: "Resolved", sub: "Awaiting confirmation", status: "upcoming", time: "--" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 neu-raised rounded-full flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-headline-sm font-bold">Track Complaint</h2>
      </div>

      {/* Summary Card */}
      {isLoading ? (
        <NeuCard className="p-4 flex gap-4 items-center">
          <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-3/4 h-5 rounded" />
            <Skeleton className="w-1/2 h-4 rounded" />
          </div>
          <Skeleton className="w-16 h-6 rounded-full" />
        </NeuCard>
      ) : (
        <NeuCard className="p-4 flex gap-4 items-center border border-inset shadow-sm">
          <img src={complaint.imageUrl} alt="Issue" className="w-16 h-16 rounded-xl object-cover" />
          <div className="flex-1">
            <h3 className="text-title-lg font-bold">{complaint.title}</h3>
            <p className="text-label-md text-text-secondary">ID: {complaint.id}</p>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
            complaint.status === "pending" ? "bg-[#FFC107]/20 text-[#FFC107]" :
            complaint.status === "in-progress" ? "bg-[#2196F3]/20 text-[#2196F3]" :
            complaint.status === "resolved" ? "bg-[#4CAF50]/20 text-[#4CAF50]" :
            "bg-error/20 text-error"
          )}>
            {complaint.status}
          </div>
        </NeuCard>
      )}

      {/* Timeline */}
      <div className="relative pl-10 space-y-12 py-4">
        {/* Track Line */}
        <div className="timeline-line" />
        
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            {/* Node */}
            <div className={cn(
              "step-dot",
              step.status === "completed" && "done",
              step.status === "active" && "active animate-pulse",
            )}>
              {step.status === "completed" ? <Check size={18} weight="bold" /> : 
               step.status === "active" ? <Clock size={18} weight="bold" /> : 
               <div className="w-2 h-2 rounded-full bg-text-secondary/30" />}
            </div>

            {/* Content */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h4 className={cn(
                  "text-title-lg font-bold",
                  step.status === "upcoming" ? "text-text-secondary" : "text-text-primary"
                )}>
                  {step.label}
                </h4>
                <span className="text-label-md text-text-secondary">{step.time}</span>
              </div>
              <p className="text-body-md text-text-secondary">{step.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Escalation Card */}
      <NeuCard className="p-4 border-l-4 border-warning flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
          <Warning size={20} weight="fill" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-label-md font-bold text-text-primary">SLA Countdown</p>
          <div className="flex justify-between items-end">
            <span className="text-body-md text-text-secondary">Will escalate in 2d 4h 12m</span>
            <span className="text-[10px] font-bold text-warning">75%</span>
          </div>
          <div className="h-1.5 w-full bg-inset neu-pressed rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              className="h-full bg-warning"
            />
          </div>
        </div>
      </NeuCard>

      {/* Community Section */}
      <section className="space-y-4">
        <h3 className="text-title-lg font-bold">Community</h3>
        <NeuCard className="p-4 flex justify-between items-center">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-surface overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-inset flex items-center justify-center text-[10px] font-bold">
              +10
            </div>
          </div>
          <p className="text-label-md text-text-secondary">14 citizens reported this</p>
          <NeuButton variant="secondary" className="h-9 px-4 text-[10px] uppercase font-bold">
            Upvote
          </NeuButton>
        </NeuCard>
      </section>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <NeuButton variant="secondary" className="flex-col h-20 gap-1 rounded-2xl">
          <ChatCircle size={20} weight="fill" className="text-primary" />
          <span className="text-[10px] font-bold uppercase">Update</span>
        </NeuButton>
        <NeuButton variant="secondary" className="flex-col h-20 gap-1 rounded-2xl">
          <ShareNetwork size={20} weight="fill" className="text-primary" />
          <span className="text-[10px] font-bold uppercase">Share</span>
        </NeuButton>
        <NeuButton variant="secondary" className="flex-col h-20 gap-1 rounded-2xl">
          <Phone size={20} weight="fill" className="text-primary" />
          <span className="text-[10px] font-bold uppercase">Contact</span>
        </NeuButton>
      </div>
    </div>
  );
};

export default Tracking;
