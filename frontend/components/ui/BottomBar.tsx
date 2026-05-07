import * as React from "react"
import { cn } from "@/lib/utils"

interface BottomBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const BottomBar = React.forwardRef<HTMLDivElement, BottomBarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute bottom-0 left-0 right-0 p-5 pb-8 pt-12 z-50 bg-gradient-to-t from-[#F2F4F6] via-[#F2F4F6] to-transparent",
          className
        )}
        {...props}
      >
        <div className="max-w-[480px] mx-auto w-full">
            {children}
        </div>
      </div>
    )
  }
)
BottomBar.displayName = "BottomBar"

export { BottomBar }
