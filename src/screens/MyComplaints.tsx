import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { NeuCard } from "@/src/components/NeuCard";
import { NeuButton } from "@/src/components/NeuButton";
import { MagnifyingGlass, Faders, CaretRight, Clock, MapPin } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Skeleton } from "@/src/components/Skeleton";

const filters = ["All", "Pending", "In Progress", "Resolved", "Escalated"];

const MyComplaints = () => {
  const { complaints, isLoading } = useStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  // Mock data if store is empty
  const displayComplaints = complaints.length > 0 ? complaints : [
    { id: "CMP-1", title: "Broken Drainage", status: "pending", category: "Drainage", timestamp: Date.now() - 1000 * 60 * 60 * 2, description: "Water leaking near the park." },
    { id: "CMP-2", title: "Streetlight Out", status: "in-progress", category: "Electrical", timestamp: Date.now() - 1000 * 60 * 60 * 24, description: "Dark street since 3 days." },
    { id: "CMP-3", title: "Pothole Fix", status: "resolved", category: "Roads", timestamp: Date.now() - 1000 * 60 * 60 * 48, description: "Dangerous hole on main road." },
  ];

  const filteredComplaints = activeFilter === "All" 
    ? displayComplaints 
    : displayComplaints.filter(c => c.status.toLowerCase() === activeFilter.toLowerCase().replace(" ", "-"));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-display-md font-bold">My Complaints</h2>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-2 -mx-6 px-6 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-6 py-2 rounded-full text-label-md font-bold uppercase transition-all whitespace-nowrap",
              activeFilter === f ? "bg-primary-gradient text-white shadow-lg" : "bg-surface neu-raised text-text-secondary"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search your reports..." 
          className="w-full bg-surface border border-inset shadow-sm rounded-2xl px-12 py-4 text-body-md focus:outline-none focus:border-primary transition-colors"
        />
        <MagnifyingGlass size={20} weight="bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <NeuCard key={i} className="p-4 flex gap-4 border border-inset shadow-sm">
              <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="w-24 h-5 rounded" />
                  <Skeleton className="w-16 h-4 rounded-full" />
                </div>
                <Skeleton className="w-full h-3 rounded" />
                <Skeleton className="w-3/4 h-3 rounded" />
              </div>
            </NeuCard>
          ))
        ) : (
          filteredComplaints.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/tracking/${c.id}`)}
            >
              <NeuCard className="p-4 flex gap-4 cursor-pointer border border-inset shadow-sm">
                <img 
                  src={`https://picsum.photos/seed/${c.id}/100/100`} 
                  alt="Issue" 
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-title-lg font-bold truncate max-w-[120px]">{c.title}</h3>
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
                      c.status === "pending" ? "bg-[#FFC107]/20 text-[#FFC107]" :
                      c.status === "in-progress" ? "bg-[#2196F3]/20 text-[#2196F3]" :
                      c.status === "resolved" ? "bg-[#4CAF50]/20 text-[#4CAF50]" :
                      "bg-error/20 text-error"
                    )}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-body-md text-text-secondary line-clamp-2">{c.description}</p>
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-1 text-text-secondary text-[10px]">
                      <Clock size={10} weight="bold" />
                      <span>2h ago</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-[10px] font-bold">
                      <span>Details</span>
                      <CaretRight size={10} weight="bold" />
                    </div>
                  </div>
                </div>
              </NeuCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
