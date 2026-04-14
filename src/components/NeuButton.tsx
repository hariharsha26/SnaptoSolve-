import React from "react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  isPill?: boolean;
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  children,
  className,
  variant = "secondary",
  size = "md",
  isPill = true,
  ...props
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const baseClasses = "flex items-center justify-center font-display font-semibold transition-all duration-150 active:scale-95";
  
  const variantClasses = {
    primary: "bg-primary-gradient text-white neu-raised shadow-primary/30",
    secondary: "bg-surface text-text-primary neu-raised",
    ghost: "bg-transparent text-text-secondary hover:bg-surface/50",
  };

  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    xl: "h-16 px-10 text-xl",
  };

  return (
    <motion.button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isPill ? "rounded-full" : "rounded-xl",
        isPressed && variant !== "ghost" && "neu-pressed scale-95",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
