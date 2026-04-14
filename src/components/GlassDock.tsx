import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Map as MapIcon, Camera, ClipboardList, Trophy } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

export const GlassDock = () => {
  const navigate = useNavigate();

  const tabs = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MapIcon, label: "Map", path: "/map" },
    { icon: Camera, label: "Snap", path: "/snap", isFab: true },
    { icon: ClipboardList, label: "Issues", path: "/my-complaints" },
    { icon: Trophy, label: "Rewards", path: "/rewards" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 px-4 pointer-events-none z-50">
      <div className="w-full max-w-md h-20 glass rounded-[32px] flex items-center justify-around px-2 pointer-events-auto border border-white/20 shadow-2xl">
        {tabs.map((tab) => {
          if (tab.isFab) {
            return (
              <div key={tab.path} className="relative -top-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(tab.path)}
                  className="w-16 h-16 rounded-full bg-primary-gradient neu-float flex items-center justify-center text-white"
                >
                  <tab.icon size={32} />
                </motion.button>
              </div>
            );
          }

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  isActive ? "text-primary" : "text-text-secondary"
                )
              }
            >
              <tab.icon size={24} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
