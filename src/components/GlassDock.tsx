import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { House, MapTrifold, Camera, ClipboardText, Trophy } from "@phosphor-icons/react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

export const GlassDock = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: House, label: "Home", path: "/" },
    { icon: MapTrifold, label: "Map", path: "/map" },
    { icon: Camera, label: "Snap", path: "/snap", isFab: true },
    { icon: ClipboardText, label: "Issues", path: "/my-complaints" },
    { icon: Trophy, label: "Rewards", path: "/rewards" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
      <div className="w-full max-w-md h-16 bg-surface border-t border-inset shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex items-center px-2 pointer-events-auto">
        {tabs.map((tab) => {
          if (tab.isFab) {
            return (
              <div key={tab.path} className="flex-1 flex justify-center items-center h-full relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(tab.path)}
                  className="absolute -top-6 w-14 h-14 rounded-full bg-primary-gradient shadow-lg flex items-center justify-center text-white border-4 border-surface"
                >
                  <tab.icon size={24} weight="fill" />
                </motion.button>
              </div>
            );
          }

          const isActive = location.pathname === tab.path;

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={
                cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
                  isActive ? "text-primary" : "text-text-secondary"
                )
              }
            >
              <tab.icon size={24} weight={isActive ? "fill" : "regular"} />
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
