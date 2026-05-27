import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ResultHeaderProps {
    name: string;
    onReset?: () => void; // Optional because sometime we just want to display header without action
}

export function ResultHeader({ name, onReset }: ResultHeaderProps) {
    return (
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-[26px] font-bold leading-[1.3] tracking-tight text-[#191F28]">
                {name}님의<br />
                <span className="text-[#3182F6]">2026년 운세</span>입니다
            </h2>
            {onReset && (
                <Button variant="ghost" className="p-2 h-auto" onClick={onReset}>
                    <RotateCcw className="w-5 h-5 text-gray-400" />
                </Button>
            )}
        </div>
    );
}
