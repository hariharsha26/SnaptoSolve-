import React from "react";
import { cn } from "@/src/lib/utils";
import { Icon } from "@phosphor-icons/react";

interface CategoryChipProps {
  icon: Icon;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ icon: IconComponent, label, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
        isSelected ? "bg-primary-gradient text-white shadow-lg" : "bg-surface neu-raised text-text-secondary"
      )}
    >
      <IconComponent size={16} weight={isSelected ? "fill" : "regular"} />
      <span className="text-label-md font-bold uppercase">{label}</span>
    </button>
  );
};
