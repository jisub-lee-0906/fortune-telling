"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";

import { StepIntro } from "@/components/features/fortune/StepIntro";
import { StepName } from "@/components/features/fortune/StepName";
import { StepBirth } from "@/components/features/fortune/StepBirth";
import { StepLoading } from "@/components/features/fortune/StepLoading";
import { StepResult } from "@/components/features/fortune/StepResult";

// --- Type Definitions ---
type Step = 'intro' | 'name' | 'birth' | 'loading' | 'result';
import type { FortuneResult } from "@/types/fortune";
export default function Home() {
  const [step, setStep] = useState<Step>('intro');
  const [direction, setDirection] = useState(1); 
  
  const [formData, setFormData] = useState({
    name: "",
    year: '',
    month: '',
    day: '',
    hour: '', 
    gender: "male"
  });

  const [result, setResult] = useState<FortuneResult | null>(null);

  // --- Handlers ---
  const nextStep = (next: Step) => {
      setDirection(1);
      setStep(next);
  };

  const handleSubmit = async () => {
    setNextStep('loading');
    
    // Prepare data
    const payload = {
        ...formData,
        year: Number(formData.year),
        month: Number(formData.month),
        day: Number(formData.day),
        hour: Number(formData.hour) || 0,
        minute: 0
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL
        || process.env.NEXT_PUBLIC_INTERNAL_API_URL
        || "http://127.0.0.1:8000";
      const res = await fetch(`${API_URL}/interpret`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === "success") {
          setResult(data.data);
          setNextStep('result');
      } else {
          alert("분석 실패: " + JSON.stringify(data));
          setNextStep('intro');
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
      setNextStep('intro');
    }
  };

  const setNextStep = (next: Step) => {
      setDirection(1);
      setStep(next);
  }

  // --- Animation Variants ---
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -20 : 20, opacity: 0 }),
  };

  return (
    <AppLayout>
        {/* Progress Bar */}
        {step !== 'intro' && step !== 'result' && step !== 'loading' && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 z-10 transition-opacity duration-300">
                <div 
                    className="h-full bg-[#3182F6] transition-all duration-500 ease-out"
                    style={{ width: step === 'name' ? '33%' : step === 'birth' ? '66%' : '100%' }}  
                />
            </div>
        )}

        <AnimatePresence custom={direction} mode="wait">
            {step === 'intro' && (
                <StepIntro onNext={() => nextStep('name')} variants={variants} />
            )}

            {step === 'name' && (
                <StepName 
                    name={formData.name} 
                    onChange={(val) => setFormData({...formData, name: val})}
                    onNext={() => nextStep('birth')}
                    variants={variants}
                />
            )}

            {step === 'birth' && (
                <StepBirth 
                    formData={formData}
                    onChange={(field, val) => setFormData({...formData, [field]: val})}
                    onNext={handleSubmit}
                    variants={variants}
                />
            )}

            {step === 'loading' && (
                <StepLoading name={formData.name} />
            )}

            {step === 'result' && result && (
                <StepResult 
                    name={formData.name}
                    result={result}
                    onReset={() => setNextStep('intro')}
                />
            )}
        </AnimatePresence>
    </AppLayout>
  );
}
