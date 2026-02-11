"use client";

import { useJoinKitStore } from "@/store/useJoinKitStore";
import ProgressBar from "@/components/ui/ProgressBar";
import StepServiceInfo from "@/components/steps/StepServiceInfo";
import StepAuthMethod from "@/components/steps/StepAuthMethod";
import StepCollectInfo from "@/components/steps/StepCollectInfo";
import StepOptions from "@/components/steps/StepOptions";
import StepPreview from "@/components/steps/StepPreview";
import StepResult from "@/components/steps/StepResult";
import type { WizardStep } from "@/types";

const STEP_ORDER: WizardStep[] = [
  "service-info",
  "auth-method",
  "collect-info",
  "options",
  "preview",
  "result",
];

const STEP_LABELS = [
  "서비스 정보",
  "가입 방식",
  "수집 정보",
  "옵션",
  "미리보기",
  "결과",
];

export default function Wizard() {
  const { currentStep } = useJoinKitStore();

  const currentIndex = STEP_ORDER.indexOf(currentStep) + 1;
  const isResult = currentStep === "result";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress */}
      {!isResult && (
        <div className="mb-8">
          <ProgressBar
            currentStep={currentIndex}
            totalSteps={STEP_ORDER.length}
            labels={STEP_LABELS}
          />
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[60vh]">
        {currentStep === "service-info" && <StepServiceInfo />}
        {currentStep === "auth-method" && <StepAuthMethod />}
        {currentStep === "collect-info" && <StepCollectInfo />}
        {currentStep === "options" && <StepOptions />}
        {currentStep === "preview" && <StepPreview />}
        {currentStep === "result" && <StepResult />}
      </div>
    </div>
  );
}
