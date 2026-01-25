import ReactMarkdown from "react-markdown";

interface InterpretationCardProps {
    interpretation: string;
}

export function InterpretationCard({ interpretation }: InterpretationCardProps) {
    // Parsing Logic: Split by '### ' (headers)
    // The backend guarantees clean headers via post-processing
    const sections = interpretation.split(/###\s+/);

    return (
        <div className="bg-white rounded-[24px] overflow-hidden p-6 shadow-sm">
            <div className="flex flex-col gap-8">
                {sections.map((section, idx) => {
                    const trimmed = section.trim();
                    if (!trimmed) return null;

                    // Extract Title vs Body
                    const firstLineEnd = trimmed.indexOf('\n');
                    let title = "";
                    let body = "";

                    if (firstLineEnd === -1) {
                        // Intro text
                        if (idx === 0) body = trimmed;
                        else title = trimmed;
                    } else {
                        title = trimmed.slice(0, firstLineEnd).trim();
                        body = trimmed.slice(firstLineEnd).trim();
                    }

                    // Special rendering for Intro
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
                            <h3 className="text-[22px] font-bold text-[#3182F6] mb-3 flex items-center">
                                <span className="w-1.5 h-6 bg-[#3182F6] rounded-full mr-3 inline-block"></span>
                                {title}
                            </h3>

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
                })}
            </div>
            <p className="text-center text-[#B0B8C1] text-xs mt-8 mb-2">운세 결과는 재미로만 봐주세요 :)</p>
        </div>
    );
}
