import React from "react";
import { useStore } from "@/src/store/useStore";
import { NeuCard } from "@/src/components/NeuCard";
import { NeuButton } from "@/src/components/NeuButton";
import { Droplets, Zap, Triangle, Trash2, PawPrint, Flame, Plus, MapPin, ChevronRight, Camera, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: Droplets, label: "Drainage", color: "text-blue-500" },
  { icon: Zap, label: "Electrical", color: "text-yellow-500" },
  { icon: Triangle, label: "Roads", color: "text-orange-500" },
  { icon: Trash2, label: "Garbage", color: "text-green-500" },
  { icon: PawPrint, label: "Animal", color: "text-purple-500" },
  { icon: Flame, label: "Fire", color: "text-red-500" },
  { icon: Plus, label: "Other", color: "text-gray-500" },
];

const Home = () => {
  const { user, complaints, theme, toggleTheme } = useStore();
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
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </NeuButton>
          <NeuCard className="w-12 h-12 overflow-hidden border-2 border-primary/20">
            <img src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" />
          </NeuCard>
        </div>
      </div>

      {/* Snap CTA */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/snap")}
          className="w-20 h-20 rounded-full bg-primary-gradient neu-float flex items-center justify-center text-white shadow-primary/30 transition-all duration-[120ms] active:neu-pressed"
        >
          <Camera size={36} />
        </motion.button>
        <p className="text-title-lg font-semibold text-text-primary">Snap Issue</p>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar">
        {categories.map((cat) => (
          <NeuButton
            key={cat.label}
            variant="secondary"
            className="flex-shrink-0 h-10 px-4 gap-2"
          >
            <cat.icon size={18} className={cat.color} />
            <span className="text-label-md">{cat.label}</span>
          </NeuButton>
        ))}
      </div>

      {/* Map Preview */}
      <NeuCard className="bento-card h-48 overflow-hidden relative group cursor-pointer p-0" onClick={() => navigate("/map")}>
        <img 
          src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/78.4867,17.3850,12,0/400x200?access_token=pk.eyJ1IjoiZGV2ZWxvcGVyIiwiYSI6ImNrZ3R6Z3Z6ejAwM20yc3B6Z3Z6ejAwM20ifQ.placeholder" 
          alt="Map Preview"
          className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="w-4 h-4 rounded-full bg-warning neu-float border-2 border-surface" />
          <div className="w-4 h-4 rounded-full bg-error neu-float border-2 border-surface" />
          <div className="w-4 h-4 rounded-full bg-success neu-float border-2 border-surface" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span className="text-label-md font-bold">Hyderabad, TS</span>
          </div>
          <ChevronRight size={20} />
        </div>
      </NeuCard>

      {/* Recent Complaints */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-headline-sm font-bold">My recent complaints</h3>
          <button className="text-primary text-label-md font-bold" onClick={() => navigate("/my-complaints")}>View all</button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <NeuCard key={complaint.id} className="bento-card w-40 flex-shrink-0 p-3 space-y-2">
                <img src={complaint.imageUrl} alt={complaint.title} className="w-full h-24 object-cover rounded-xl" />
                <h4 className="text-title-lg truncate">{complaint.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/20 text-warning font-bold uppercase">
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
          {[1, 2, 3].map((i) => (
            <NeuCard key={i} className="bento-card p-4 flex gap-4 items-center">
              <img 
                src={`https://picsum.photos/seed/issue${i}/100/100`} 
                alt="Issue" 
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="text-title-lg">Broken Streetlight</h4>
                <div className="flex items-center gap-2 text-text-secondary text-label-md">
                  <MapPin size={12} />
                  <span>200m away</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <NeuButton variant="secondary" className="w-10 h-10 p-0">
                  <Plus size={20} />
                </NeuButton>
                <span className="text-[10px] font-bold">14</span>
              </div>
            </NeuCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
