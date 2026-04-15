import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useStore } from "@/src/store/useStore";
import { NeuCard } from "@/src/components/NeuCard";
import { NeuButton } from "@/src/components/NeuButton";
import { MagnifyingGlass, Faders, MapPin, Drop, Lightning, Warning, Trash, CaretRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";

// Custom Marker Icon
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid var(--surface); box-shadow: 0 4px 8px rgba(0,0,0,0.2); display: flex; items-center; justify-content: center; color: white;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const issues = [
  { id: "1", lat: 17.3850, lng: 78.4867, title: "Drainage Overflow", category: "Drainage", status: "pending", color: "#ff9f43" },
  { id: "2", lat: 17.3950, lng: 78.4767, title: "Broken Streetlight", category: "Electrical", status: "in-progress", color: "#0040a1" },
  { id: "3", lat: 17.3750, lng: 78.4967, title: "Pothole on Main Rd", category: "Roads", status: "resolved", color: "#28c76f" },
  { id: "4", lat: 17.4050, lng: 78.4667, title: "Garbage Pile", category: "Garbage", status: "escalated", color: "#ea5455" },
];

const MapView = () => {
  const navigate = useNavigate();
  const { theme } = useStore();
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const tileUrl = theme === "dark" 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="absolute inset-0 pb-16">
      <MapContainer 
        center={[17.3850, 78.4867]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {issues.map((issue) => (
          <Marker 
            key={issue.id} 
            position={[issue.lat, issue.lng]} 
            icon={createMarkerIcon(issue.color)}
            eventHandlers={{
              click: () => setSelectedIssue(issue),
            }}
          />
        ))}
      </MapContainer>

      {/* Search Bar */}
      <div className="absolute top-6 left-6 right-6 z-[1000]">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search location or issue..." 
            className="w-full bg-surface border border-inset shadow-sm rounded-full px-12 py-3 text-body-md focus:outline-none focus:border-primary transition-colors"
          />
          <MagnifyingGlass size={20} weight="bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
            <Faders size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            className="absolute bottom-0 left-0 right-0 z-[1001] p-6"
          >
            <NeuCard className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-inset flex items-center justify-center text-primary">
                    <Drop size={32} weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-title-lg font-bold">{selectedIssue.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
                        selectedIssue.status === "pending" ? "bg-[#FFC107]/20 text-[#FFC107]" :
                        selectedIssue.status === "in-progress" ? "bg-[#2196F3]/20 text-[#2196F3]" :
                        selectedIssue.status === "resolved" ? "bg-[#4CAF50]/20 text-[#4CAF50]" :
                        "bg-error/20 text-error"
                      )}>
                        {selectedIssue.status}
                      </span>
                      <span className="text-label-md text-text-secondary">• {selectedIssue.category}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="text-text-secondary">
                  <CaretRight size={24} weight="bold" className="rotate-90" />
                </button>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2 text-text-secondary text-label-md">
                  <MapPin size={14} weight="fill" />
                  <span>Jubilee Hills, Hyderabad</span>
                </div>
                <span className="text-label-md font-bold">14 reports</span>
              </div>

              <NeuButton 
                variant="primary" 
                className="w-full"
                onClick={() => navigate(`/tracking/${selectedIssue.id}`)}
              >
                View Full Details
              </NeuButton>
            </NeuCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapView;
