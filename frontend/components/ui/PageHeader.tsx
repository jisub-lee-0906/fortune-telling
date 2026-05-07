import { cn } from "@/lib/utils";

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
  subTitle?: string;
}

export function PageHeader({ children, className, subTitle }: PageHeaderProps) {
  return (
    <div className={cn("px-6 pt-12 pb-8", className)}>
      <h1 className="text-[26px] font-bold leading-[1.3] text-[#191F28] tracking-tight whitespace-pre-wrap">
        {children}
      </h1>
      {subTitle && (
        <p className="mt-3 text-[17px] leading-[1.5] text-[#8B95A1] font-medium tracking-tight whitespace-pre-wrap">
          {subTitle}
        </p>
      )}
    </div>
  );
}
