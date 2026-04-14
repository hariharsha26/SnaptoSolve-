import React from "react";
import { useStore } from "@/src/store/useStore";
import { NeuCard } from "@/src/components/NeuCard";
import { NeuButton } from "@/src/components/NeuButton";
import { Trophy, Star, Shield, Award, Zap, ArrowUpRight, Gift, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

const badges = [
  { id: 1, name: "First Snap", icon: Camera, earned: true, desc: "Reported your first issue" },
  { id: 2, name: "Civic Hero", icon: Shield, earned: true, desc: "10 issues resolved" },
  { id: 3, name: "Top Voter", icon: Star, earned: true, desc: "Upvoted 50 community issues" },
  { id: 4, name: "Fast Tracker", icon: Zap, earned: false, desc: "Reported an urgent fire hazard" },
  { id: 5, name: "Guardian", icon: Award, earned: false, desc: "Reached 5000 points" },
  { id: 6, name: "Clean City", icon: Trash2, earned: true, desc: "Reported 5 garbage piles" },
  { id: 7, name: "Road Master", icon: Triangle, earned: false, desc: "Reported 10 road issues" },
  { id: 8, name: "Eco Warrior", icon: Droplets, earned: true, desc: "Reported 5 drainage issues" },
];

import { Camera, Trash2, Droplets, Triangle } from "lucide-react";

const Rewards = () => {
  const { user } = useStore();

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-display-md font-bold">Rewards</h2>

      {/* Profile Banner */}
      <NeuCard className="bento-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-primary p-1">
              <img 
                src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-gradient flex items-center justify-center text-white border-2 border-surface">
              <Trophy size={12} />
            </div>
          </div>
          <div>
            <h3 className="text-title-lg font-bold">{user?.displayName || "Citizen"}</h3>
            <p className="text-body-md text-primary font-semibold">{user?.rank || "Civic Guardian"}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-display-md font-bold text-primary">{user?.points || 1250}</p>
            <p className="text-[10px] font-bold uppercase text-text-secondary">Total Points</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-label-md font-bold">
            <span className="text-text-secondary uppercase">Rank Progress</span>
            <span className="text-primary">75% to Elite Guardian</span>
          </div>
          <div className="h-2 w-full bg-inset neu-pressed rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              className="h-full bg-primary-gradient"
            />
          </div>
        </div>
      </NeuCard>

      {/* Badges Grid */}
      <section className="space-y-4">
        <h3 className="text-headline-sm font-bold">My Badges</h3>
        <div className="grid grid-cols-4 gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2"
            >
              <NeuCard className={cn(
                "w-16 h-16 flex items-center justify-center rounded-[20px] transition-all",
                badge.earned ? "bg-primary/5 text-primary" : "opacity-30 grayscale"
              )}>
                <badge.icon size={28} />
              </NeuCard>
              <span className="text-[10px] font-bold text-center leading-tight">{badge.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Points History */}
      <section className="space-y-4">
        <h3 className="text-headline-sm font-bold">Points History</h3>
        <div className="space-y-3">
          {[
            { label: "Issue Resolved", points: "+500", date: "Today", type: "success" },
            { label: "Community Upvote", points: "+10", date: "Yesterday", type: "success" },
            { label: "Daily Login", points: "+50", date: "2 days ago", type: "success" },
          ].map((item, i) => (
            <NeuCard key={i} className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-inset flex items-center justify-center text-primary">
                  <ArrowUpRight size={20} />
                </div>
                <div>
                  <p className="text-title-lg font-bold">{item.label}</p>
                  <p className="text-label-md text-text-secondary">{item.date}</p>
                </div>
              </div>
              <span className="text-title-lg font-bold text-success">{item.points}</span>
            </NeuCard>
          ))}
        </div>
      </section>

      {/* Coupons */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-headline-sm font-bold">Redeem Rewards</h3>
          <button className="text-primary text-label-md font-bold">View all</button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar">
          {[
            { title: "50% Off Bus Pass", partner: "City Transit", points: 1000 },
            { title: "Free Coffee", partner: "Civic Cafe", points: 500 },
            { title: "Park Entry", partner: "Municipal Parks", points: 300 },
          ].map((coupon, i) => (
            <NeuCard key={i} className="bento-card w-48 flex-shrink-0 p-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Gift size={24} />
              </div>
              <div>
                <h4 className="text-title-lg font-bold leading-tight">{coupon.title}</h4>
                <p className="text-label-md text-text-secondary">{coupon.partner}</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-label-md font-bold text-primary">{coupon.points} pts</span>
                <NeuButton variant="primary" className="h-8 px-3 text-[10px] uppercase">Redeem</NeuButton>
              </div>
            </NeuCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rewards;
