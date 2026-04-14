import React from "react";
import { cn } from "@/src/lib/utils";

interface StatusChipProps {
  status: "pending" | "in-progress" | "resolved" | "escalated";
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, className }) => {
  const styles = {
    pending: "bg-warning/20 text-warning",
    "in-progress": "bg-primary/20 text-primary",
    resolved: "bg-success/20 text-success",
    escalated: "bg-error/20 text-error",
  };

  return (
    <span className={cn(
      "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
      styles[status],
      className
    )}>
      {status.replace("-", " ")}
    </span>
  );
};
