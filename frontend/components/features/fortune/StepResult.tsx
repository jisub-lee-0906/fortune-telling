import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Loader2, RotateCcw } from "lucide-react";
import { toPng } from 'html-to-image';
import { BottomBar } from "@/components/ui/BottomBar";
import { Button } from "@/components/ui/Button";
import { ResultHeader } from "./result/ResultHeader";
import { SajuPillars } from "./result/SajuPillars";
import { ElementsChart } from "./result/ElementsChart";
import { InterpretationCard } from "./result/InterpretationCard";
import type { FortuneResult } from "@/types/fortune";

type ShareableNavigator = Navigator & {
  share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
};

interface StepResultProps {
  name: string;
  result: FortuneResult;
  onReset: () => void;
}

export function StepResult({ name, result, onReset }: StepResultProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setIsSaving(true);

    try {
      const dataUrl = await toPng(contentRef.current, {
        cacheBust: true,
        backgroundColor: "#F2F4F6",
        style: {
          overflow: 'visible',
          height: 'auto'
        }
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${name}님의_2026년_새해운세.png`;
      link.click();
    } catch (err) {
      console.error("Failed to capture image:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    const nav = navigator as ShareableNavigator;
    if (nav.share) {
      try {
        await nav.share({
          title: `${name}님의 2026년 운세`,
          text: "나의 2026년 운세를 확인해보세요!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 복사되었습니다!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-[#F2F4F6] relative flex flex-col overflow-hidden"
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#F2F4F6]">
        {/* Inner wrapper for full-height capture */}
        <div ref={contentRef} className="pb-32 bg-[#F2F4F6]">
          {/* Result Header & Summary */}
          <div className="bg-white px-6 pt-12 pb-10 rounded-b-[32px] shadow-sm mb-6 relative">
            <ResultHeader name={name} onReset={onReset} />
            <SajuPillars saju={result.saju} />
            <ElementsChart analysis={result.analysis} />
          </div>

          {/* Interpretation Card */}
          <div className="px-5">
            <InterpretationCard interpretation={result.interpretation} />
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM BAR - Action Buttons */}
      <BottomBar>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 w-full">
          {/* Share Button */}
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-1 h-auto py-3 border-gray-200 hover:bg-gray-50 bg-white"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
            <span className="text-[11px] font-medium text-gray-600">공유</span>
          </Button>

          {/* Save Image Button */}
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isSaving}
            className="flex flex-col items-center justify-center gap-1 h-auto py-3 border-gray-200 hover:bg-gray-50 bg-white"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 text-[#3182F6] animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-[#3182F6]" />
            )}
            <span className="text-[11px] font-medium text-[#3182F6]">저장</span>
          </Button>

          {/* Reset Button */}
          <Button
            onClick={onReset}
            className="flex flex-col items-center justify-center gap-1 h-auto py-3 bg-[#333D4B] hover:bg-[#191F28] text-white"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[11px] font-medium">다시하기</span>
          </Button>
        </div>
      </BottomBar>
    </motion.div>
  );
}
