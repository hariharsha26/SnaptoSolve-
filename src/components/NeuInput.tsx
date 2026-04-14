import React from "react";
import { cn } from "@/src/lib/utils";

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  isTextArea?: boolean;
}

export const NeuInput: React.FC<NeuInputProps> = ({
  label,
  className,
  isTextArea = false,
  ...props
}) => {
  const InputComponent = isTextArea ? "textarea" : "input";

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-label-md font-medium text-text-secondary ml-2">{label}</label>}
      <InputComponent
        className={cn(
          "w-full bg-inset neu-pressed rounded-2xl px-4 py-3 text-body-md text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
          isTextArea ? "min-h-[120px] resize-none" : "h-12",
          className
        )}
        {...(props as any)}
      />
    </div>
  );
};
