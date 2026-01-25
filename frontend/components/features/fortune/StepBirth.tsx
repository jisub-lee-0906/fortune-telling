import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { BottomBar } from "@/components/ui/BottomBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface StepBirthProps {
  formData: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  onChange: (field: string, val: string) => void;
  onNext: () => void;
  variants: any;
}

export function StepBirth({ formData, onChange, onNext, variants }: StepBirthProps) {
  const isValid = formData.year && formData.month && formData.day;

  return (
    <motion.div
      key="birth"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <PageHeader subTitle="양력/음력 상관없이 입력해주시면 돼요">
        생년월일을<br />알려주세요
      </PageHeader>

      <div className="px-6 space-y-3">
        <Input
          type="number"
          placeholder="태어난 연도 (예: 1990)"
          value={formData.year}
          onChange={(e) => onChange("year", e.target.value)}
        />

        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="월"
            className="text-center"
            value={formData.month}
            onChange={(e) => onChange("month", e.target.value)}
          />
          <Input
            type="number"
            placeholder="일"
            className="text-center"
            value={formData.day}
            onChange={(e) => onChange("day", e.target.value)}
          />
        </div>

        <Input
          type="number"
          placeholder="태어난 시간 (0~23시)"
          value={formData.hour}
          onChange={(e) => onChange("hour", e.target.value)}
        />
        <p className="text-[13px] text-[#8B95A1] pl-1">* 시간을 모르시면 0으로 적어주세요</p>
      </div>

      <BottomBar>
        <Button className="w-full" disabled={!isValid} onClick={onNext}>
          운세 결과 보기
        </Button>
      </BottomBar>
    </motion.div>
  );
}
