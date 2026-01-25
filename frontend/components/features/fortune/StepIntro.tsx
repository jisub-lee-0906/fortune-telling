import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { BottomBar } from "@/components/ui/BottomBar";
import { Button } from "@/components/ui/Button";

interface StepIntroProps {
  onNext: () => void;
  variants: any;
}

export function StepIntro({ onNext, variants }: StepIntroProps) {
  return (
    <motion.div
      key="intro"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col h-[100dvh] relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-400/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[250px] h-[250px] bg-purple-400/10 blur-[80px] rounded-full pointer-events-none" />

      <PageHeader className="relative z-10 mt-6" subTitle="2026년, 당신의 운명을 읽어보세요">
        <span className="text-4xl font-light block mb-2 opacity-90">Anti-Gravity</span>
        운세 AI
      </PageHeader>

      {/* Main Visual Area - Abstract & Minimal */}
      <div className="flex-1 flex flex-col items-center justifying-center mt-10 relative z-0">
         {/* Abstract Sphere Representation (CSS only) */}
         <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-white rounded-full shadow-[0_20px_50px_rgba(49,130,246,0.15)] flex items-center justify-center mb-8 animate-pulse-slow ring-1 ring-white/50">
            <div className="w-40 h-40 bg-gradient-to-tr from-white to-blue-50 rounded-full flex items-center justify-center shadow-inner">
               <span className="text-6xl grayscale opacity-80">🔮</span> 
            </div>
         </div>
         <p className="text-[#8B95A1] text-center text-sm font-medium leading-relaxed opacity-80">
            생년월일만으로<br/>
            현대적인 사주 해석을 받아보세요
         </p>
      </div>

      <BottomBar className="bg-gradient-to-t from-[#F2F4F6] via-[#F2F4F6] to-transparent">
        <Button 
            className="w-full bg-[#3182F6] hover:bg-[#1B64DA] text-white border-none shadow-lg shadow-blue-500/20 rounded-[20px] font-bold text-lg" 
            size="lg"
            onClick={onNext}
        >
          내 운세 확인하기
        </Button>
      </BottomBar>
    </motion.div>
  );
}
