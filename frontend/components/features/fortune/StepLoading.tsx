import { motion } from "framer-motion";
import RitualLoader from "@/components/common/RitualLoader";

interface StepLoadingProps {
  name: string;
}

export function StepLoading({ name }: StepLoadingProps) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md"
    >
      <RitualLoader />
      <h3 className="mt-8 text-xl font-bold text-[#191F28] tracking-tight text-center">
        {name}님의 사주를<br />분석하고 있어요
      </h3>
      <p className="mt-2 text-[#8B95A1] text-sm font-medium">잠시만 기다려주세요...</p>
    </motion.div>
  );
}
