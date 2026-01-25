import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Download, Share2, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toPng } from "html-to-image";
import { BottomBar } from "@/components/ui/BottomBar";
import { Button } from "@/components/ui/Button";

interface ApiResult {
  saju: { year: string; month: string; day: string; hour: string };
  analysis: {
    summary_for_llm: string;
    day_master: { name: string; element: string };
    elements: Record<string, number>;
  };
  interpretation: string;
}

interface StepResultProps {
  name: string;
  result: ApiResult;
  onReset: () => void;
}

export function StepResult({ name, result, onReset }: StepResultProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setIsSaving(true);

    try {
      // 1. Convert to PNG using html-to-image
      const dataUrl = await toPng(contentRef.current, {
        cacheBust: true,
        backgroundColor: "#F2F4F6", // Ensure background color is captured
        style: {
          // Ensure full height capture even if scrolled
          overflow: 'visible',
          height: 'auto'
        }
      });

      // 2. Trigger download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${name}님의_2026년_새해운세.png`;
      link.click();
    } catch (err) {
      console.error("Failed to capture image:", err);
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    // Basic Web Share API
    const nav = navigator as any;
    if (nav.share) {
      try {
        await nav.share({
          title: `${name}님의 2026년 운세`,
          text: "나의 2026년 운세를 확인해보세요!",
          url: window.location.href, // Or your deployed URL
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      // Fallback: Copy clipboard
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
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-[26px] font-bold leading-[1.3] tracking-tight text-[#191F28]">
                {name}님의<br />
                <span className="text-[#3182F6]">2026년 운세</span>입니다
              </h2>
              <Button variant="ghost" className="p-2 h-auto" onClick={onReset}>
                <RotateCcw className="w-5 h-5 text-gray-400" />
              </Button>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {["년주", "월주", "일주", "시주"].map((label, idx) => (
                <div key={label} className="bg-[#F9FAFB] rounded-[18px] py-4 flex flex-col items-center">
                  <span className="text-[12px] text-[#8B95A1] mb-1 font-medium">{label}</span>
                  <span className="text-[18px] font-bold text-[#333D4B]">
                    {[result.saju.year, result.saju.month, result.saju.day, result.saju.hour][idx]}
                  </span>
                </div>
              ))}
            </div>

            {/* Element Summary (Visual Breakdown) */}
            <div className="bg-white rounded-[24px] p-6 mb-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[16px] font-bold text-[#191F28]">오행 분석</span>
                <span className="text-[13px] text-[#8B95A1] font-medium">나의 기운 분포</span>
              </div>

              <div className="space-y-3">
                {[
                  { key: "Wood", label: "목(나무)", color: "bg-green-500", bg: "bg-green-50" },
                  { key: "Fire", label: "화(불)", color: "bg-red-500", bg: "bg-red-50" },
                  { key: "Earth", label: "토(땅)", color: "bg-yellow-500", bg: "bg-yellow-50" },
                  { key: "Metal", label: "금(쇠)", color: "bg-gray-400", bg: "bg-gray-100" },
                  { key: "Water", label: "수(물)", color: "bg-blue-500", bg: "bg-blue-50" },
                ].map((el) => {
                  const count = result.analysis.elements[el.key] || 0;
                  const max = 5; // Assumed max for bar width calc
                  const width = Math.min((count / max) * 100, 100);

                  return (
                    <div key={el.key} className="flex items-center justify-between">
                      <span className="text-[14px] font-medium text-[#4E5968] w-16">{el.label}</span>
                      <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${el.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <span className={`text-[13px] font-bold px-2 py-0.5 rounded-[6px] ${el.bg} text-[#333D4B]`}>
                        {count}개
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-[15px] text-[#333D4B] leading-[1.6]">
                  당신은 <span className="font-bold text-[#3182F6]">{result.analysis.day_master.name}</span> 일간입니다.
                </p>
              </div>
            </div>
          </div>

          {/* Interpretation Card */}
          <div className="px-5">
            <div className="bg-white rounded-[24px] overflow-hidden p-6 shadow-sm">
              {/* Do not use single Markdown block. Parse and split sections for perfect control */}
              <div className="flex flex-col gap-8">
                {(() => {
                  // 1. Parsing Logic: Split by '### ' (headers)
                  // The backend guarantees clean headers via post-processing
                  const rawText = result.interpretation;
                  const sections = rawText.split(/###\s+/);

                  return sections.map((section, idx) => {
                    const trimmed = section.trim();
                    if (!trimmed) return null;

                    // Extract Title vs Body
                    // format: "Title\n\nBody..."
                    const firstLineEnd = trimmed.indexOf('\n');
                    let title = "";
                    let body = "";

                    if (firstLineEnd === -1) {
                      // unexpected case: only title or only body? 
                      // Assume it's intro text if idx === 0 and doesn't look like a header
                      if (idx === 0) body = trimmed;
                      else title = trimmed;
                    } else {
                      title = trimmed.slice(0, firstLineEnd).trim();
                      body = trimmed.slice(firstLineEnd).trim();
                    }

                    // Special rendering for the first chunk if it lacks a recognizable title (Intro)
                    if (idx === 0 && !["총운", "재물", "직업", "연애", "건강", "개운"].some(k => title.includes(k))) {
                      return (
                        <div key="intro" className="text-[16px] text-[#333D4B] leading-[1.8] mb-4">
                          <ReactMarkdown>{trimmed}</ReactMarkdown>
                        </div>
                      );
                    }

                    // Render Structured Card
                    return (
                      <div key={idx} className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                        {/* Explicit Title Styling */}
                        <h3 className="text-[22px] font-bold text-[#3182F6] mb-3 flex items-center">
                          <span className="w-1.5 h-6 bg-[#3182F6] rounded-full mr-3 inline-block"></span>
                          {title}
                        </h3>

                        {/* Body Content with Relaxed Spacing */}
                        <div className="text-[16px] text-[#4E5968] leading-[1.9] tracking-tight bg-[#F9FAFB] p-5 rounded-[16px]">
                          <ReactMarkdown components={{
                            strong: ({ node, ...props }: any) => <span className="font-bold text-[#191F28] bg-[#E8F3FF] px-1 rounded" {...props} />,
                            p: ({ node, ...props }: any) => <p className="mb-3 last:mb-0" {...props} />,
                            ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-2" {...props} />,
                            li: ({ node, ...props }: any) => <li className="pl-1" {...props} />
                          }}>
                            {body}
                          </ReactMarkdown>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              <p className="text-center text-[#B0B8C1] text-xs mt-8 mb-2">운세 결과는 재미로만 봐주세요 :)</p>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM BAR - Now with Action Buttons */}
      <BottomBar>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 w-full">
          {/* Share Button (Left) */}
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-1 h-auto py-3 border-gray-200 hover:bg-gray-50 bg-white"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
            <span className="text-[11px] font-medium text-gray-600">공유</span>
          </Button>

          {/* Save Image Button (Center) */}
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

          {/* Home Button (Right) */}
          <Button
            onClick={onReset}
            className="flex flex-col items-center justify-center gap-1 h-auto py-3 bg-[#333D4B] hover:bg-[#191F28] text-white"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[11px] font-medium">다시하기</span>
          </Button>
        </div>
      </BottomBar>
    </motion.div >
  );
}
