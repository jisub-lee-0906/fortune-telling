import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AppLayout({ children, className, bgWhite = false }: { children: ReactNode; className?: string; bgWhite?: boolean }) {
  return (
    <div className="min-h-[100dvh] bg-[#F2F4F6] flex justify-center items-center">
      <div 
        className={cn(
            "w-full max-w-[480px] h-[100dvh] relative flex flex-col mx-auto shadow-2xl overflow-hidden bg-white", 
            bgWhite ? "bg-white" : "bg-[#F2F4F6]",
            className
        )}
      >
        {children}
      </div>
    </div>
  );
}
