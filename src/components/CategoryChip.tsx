import React from "react";
import { cn } from "@/src/lib/utils";
import { LucideIcon } from "lucide-react";

interface CategoryChipProps {
  icon: LucideIcon;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ icon: Icon, label, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
        isSelected ? "bg-primary-gradient text-white shadow-lg" : "bg-surface neu-raised text-text-secondary"
      )}
    >
      <Icon size={16} />
      <span className="text-label-md font-bold uppercase">{label}</span>
    </button>
  );
};
