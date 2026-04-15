import React from "react";
import { useStore } from "@/src/store/useStore";
import { NeuCard } from "@/src/components/NeuCard";
import { NeuButton } from "@/src/components/NeuButton";
import { Drop, Lightning, Warning, Trash, PawPrint, Fire, Plus, MapPin, CaretRight, Camera, Moon, Sun } from "@phosphor-icons/react";
import { Skeleton } from "@/src/components/Skeleton";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";

const categories = [
  { icon: Drop, label: "Drainage", color: "text-blue-500" },
  { icon: Lightning, label: "Electrical", color: "text-yellow-500" },
  { icon: Warning, label: "Roads", color: "text-orange-500" },
  { icon: Trash, label: "Garbage", color: "text-green-500" },
  { icon: PawPrint, label: "Animal", color: "text-purple-500" },
  { icon: Fire, label: "Fire", color: "text-red-500" },
  { icon: Plus, label: "Other", color: "text-gray-500" },
];

const Home = () => {
  const { user, complaints, theme, toggleTheme, isLoading } = useStore();
  const navigate = useNavigate();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-display-md text-text-primary">
            {getTimeGreeting()},
          </h2>
          <h1 className="text-display-lg text-primary font-bold">
            {user?.displayName?.split(" ")[0] || "Citizen"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <NeuButton
            variant="secondary"
            className="w-10 h-10 p-0 rounded-xl"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon size={20} weight="fill" /> : <Sun size={20} weight="fill" />}
          </NeuButton>
          <NeuCard className="w-12 h-12 overflow-hidden border-2 border-primary/20 p-0">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : (
              <img src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" className="w-full h-full object-cover" />
            )}
          </NeuCard>
        </div>
      </div>

      {/* Map Preview as Primary Focal Point */}
      <div className="relative w-full h-[55vh] rounded-[24px] overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.15)] border border-inset">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <>
            <div className="absolute inset-0 pointer-events-none z-0">
              <MapContainer 
                center={[17.3850, 78.4867]} 
                zoom={13} 
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
              >
                <TileLayer
                  url={theme === "dark" 
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                />
              </MapContainer>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />
            
            {/* Categories over map */}
            <div className="absolute top-4 left-0 right-0 z-20">
              <div className="flex overflow-x-auto gap-3 px-4 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    className="flex-shrink-0 h-10 px-4 gap-2 bg-surface/90 backdrop-blur-md rounded-full flex items-center shadow-sm border border-inset"
                  >
                    <cat.icon size={18} weight="fill" className={cat.color} />
                    <span className="text-label-md font-semibold text-text-primary">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white z-20 cursor-pointer" onClick={() => navigate("/map")}>
              <div className="flex items-center gap-2">
                <MapPin size={20} weight="fill" />
                <span className="text-title-lg font-bold">Hyderabad, TS</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                <span className="text-label-md font-semibold">Expand Map</span>
                <CaretRight size={16} weight="bold" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Complaints */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-headline-sm font-bold">My recent complaints</h3>
          <button className="text-primary text-label-md font-bold" onClick={() => navigate("/my-complaints")}>View all</button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <NeuCard key={i} className="bento-card w-40 flex-shrink-0 p-3 space-y-2">
                <Skeleton className="w-full h-24 rounded-xl" />
                <Skeleton className="w-3/4 h-5 rounded" />
                <div className="flex justify-between items-center">
                  <Skeleton className="w-16 h-4 rounded-full" />
                  <Skeleton className="w-10 h-4 rounded" />
                </div>
              </NeuCard>
            ))
          ) : complaints.length > 0 ? (
            complaints.map((complaint) => (
              <NeuCard key={complaint.id} className="bento-card w-40 flex-shrink-0 p-3 space-y-2">
                <img src={complaint.imageUrl} alt={complaint.title} className="w-full h-24 object-cover rounded-xl" />
                <h4 className="text-title-lg truncate">{complaint.title}</h4>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                    complaint.status === "pending" ? "bg-[#FFC107]/20 text-[#FFC107]" :
                    complaint.status === "in-progress" ? "bg-[#2196F3]/20 text-[#2196F3]" :
                    "bg-[#4CAF50]/20 text-[#4CAF50]"
                  }`}>
                    {complaint.status}
                  </span>
                  <span className="text-label-md text-text-secondary">2h ago</span>
                </div>
              </NeuCard>
            ))
          ) : (
            <div className="w-full py-8 text-center text-text-secondary italic">
              No recent complaints. Start by snapping an issue!
            </div>
          )}
        </div>
      </section>

      {/* Nearby Issues */}
      <section className="space-y-4">
        <h3 className="text-headline-sm font-bold">Nearby community issues</h3>
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <NeuCard key={i} className="bento-card p-4 flex gap-4 items-center">
                <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-5 rounded" />
                  <Skeleton className="w-1/2 h-4 rounded" />
                </div>
                <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
              </NeuCard>
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <NeuCard key={i} className="bento-card p-4 flex gap-4 items-center">
                <img 
                  src={`https://picsum.photos/seed/issue${i}/100/100`} 
                  alt="Issue" 
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-title-lg">Broken Streetlight</h4>
                  <div className="flex items-center gap-2 text-text-secondary text-label-md">
                    <MapPin size={12} weight="fill" />
                    <span>200m away</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <NeuButton variant="secondary" className="w-10 h-10 p-0">
                    <Plus size={20} weight="bold" />
                  </NeuButton>
                  <span className="text-[10px] font-bold">14</span>
                </div>
              </NeuCard>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
