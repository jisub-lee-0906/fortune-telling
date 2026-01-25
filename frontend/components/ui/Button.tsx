import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "lg", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[18px] font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.96]",
          // Size Variants
          size === "lg" && "h-[56px] px-6 text-[17px] tracking-tight",
          size === "md" && "h-[48px] px-4 text-[15px]",
          // Color Variants
          variant === "primary" && "bg-[#3182F6] text-white hover:bg-[#1B64DA] shadow-[0_4px_14px_rgba(49,130,246,0.3)] border-none active:shadow-none active:scale-[0.98]",
          variant === "secondary" && "bg-[#E8F3FF] text-[#1B64DA] hover:bg-[#D4E8FF] border-none",
          variant === "ghost" && "bg-transparent text-[#6B7684] hover:bg-[#F2F4F6] border-none",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
