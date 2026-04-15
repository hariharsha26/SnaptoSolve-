import React from "react";
import { cn } from "@/src/lib/utils";

interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "raised" | "pressed" | "float";
}

export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  className,
  variant = "raised",
  ...props
}) => {
  const variantClasses = {
    raised: "neu-raised bg-surface border border-inset",
    pressed: "neu-pressed bg-inset",
    float: "neu-float bg-surface border border-inset",
  };

  return (
    <div
      className={cn(
        "rounded-[24px] transition-all duration-300",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
