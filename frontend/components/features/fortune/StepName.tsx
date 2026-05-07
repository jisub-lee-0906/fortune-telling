import { motion, type Variants } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { BottomBar } from "@/components/ui/BottomBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface StepNameProps {
  name: string;
  onChange: (val: string) => void;
  onNext: () => void;
  variants: Variants;
}

export function StepName({ name, onChange, onNext, variants }: StepNameProps) {
  return (
    <motion.div
      key="name"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <PageHeader subTitle="정확한 사주 분석을 위해 필요해요">
        성함이<br />어떻게 되시나요?
      </PageHeader>

      <div className="px-6">
        <Input
          placeholder="홍길동"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      </div>

      <BottomBar>
        <Button className="w-full" disabled={!name} onClick={onNext}>
          다음
        </Button>
      </BottomBar>
    </motion.div>
  );
}
