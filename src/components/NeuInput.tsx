import React, { useState } from "react";
import { cn } from "@/src/lib/utils";

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  isTextArea?: boolean;
}

export const NeuInput: React.FC<NeuInputProps> = ({
  label,
  className,
  isTextArea = false,
  value,
  ...props
}) => {
  const InputComponent = isTextArea ? "textarea" : "input";
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== "";

  return (
    <div className="relative w-full">
      <InputComponent
        className={cn(
          "w-full bg-surface border border-inset shadow-sm rounded-2xl px-4 pt-6 pb-2 text-body-md text-text-primary focus:outline-none focus:border-primary transition-all",
          isTextArea ? "min-h-[120px] resize-none" : "",
          className
        )}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e as any);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e as any);
        }}
        value={value}
        {...(props as any)}
      />
      {label && (
        <label
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            isFocused || hasValue
              ? "top-2 text-[10px] font-bold text-primary uppercase"
              : "top-4 text-body-md text-text-secondary"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};
