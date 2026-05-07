interface ElementsChartProps {
    analysis: {
        day_master: { name: string; element: string };
        elements: Record<string, number>;
    };
}

export function ElementsChart({ analysis }: ElementsChartProps) {
    const elementConfig = [
        { key: "Wood", label: "목(나무)", color: "bg-green-500", bg: "bg-green-50" },
        { key: "Fire", label: "화(불)", color: "bg-red-500", bg: "bg-red-50" },
        { key: "Earth", label: "토(땅)", color: "bg-yellow-500", bg: "bg-yellow-50" },
        { key: "Metal", label: "금(쇠)", color: "bg-gray-400", bg: "bg-gray-100" },
        { key: "Water", label: "수(물)", color: "bg-blue-500", bg: "bg-blue-50" },
    ];

    return (
        <div className="bg-white rounded-[24px] p-6 mb-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[16px] font-bold text-[#191F28]">오행 분석</span>
                <span className="text-[13px] text-[#8B95A1] font-medium">나의 기운 분포</span>
            </div>

            <div className="space-y-3">
                {elementConfig.map((el) => {
                    const count = analysis.elements[el.key] || 0;
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
                    당신은 <span className="font-bold text-[#3182F6]">{analysis.day_master.name}</span> 일간입니다.
                </p>
            </div>
        </div>
    );
}
