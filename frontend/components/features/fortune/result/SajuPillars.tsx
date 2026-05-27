interface SajuPillarsProps {
    saju: {
        year: string;
        month: string;
        day: string;
        hour: string;
    };
}

export function SajuPillars({ saju }: SajuPillarsProps) {
    const pillars = [
        { label: "년주", value: saju.year },
        { label: "월주", value: saju.month },
        { label: "일주", value: saju.day },
        { label: "시주", value: saju.hour },
    ];

    return (
        <div className="grid grid-cols-4 gap-2 mb-8">
            {pillars.map((item) => (
                <div key={item.label} className="bg-[#F9FAFB] rounded-[18px] py-4 flex flex-col items-center">
                    <span className="text-[12px] text-[#8B95A1] mb-1 font-medium">{item.label}</span>
                    <span className="text-[18px] font-bold text-[#333D4B]">
                        {item.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
