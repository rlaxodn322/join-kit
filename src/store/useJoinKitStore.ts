"use client";

import { create } from "zustand";
import type {
  TermsGeneratorInput,
  WizardStep,
  JoinKitResult,
} from "@/types";

interface JoinKitState {
  // 위자드 단계
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;

  // 입력 데이터
  input: TermsGeneratorInput;
  updateInput: (partial: Partial<TermsGeneratorInput>) => void;
  resetInput: () => void;

  // 결과
  result: JoinKitResult | null;
  setResult: (result: JoinKitResult) => void;

  // 로딩 상태
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
}

const defaultInput: TermsGeneratorInput = {
  serviceName: "",
  serviceType: "web",
  serviceUrl: "",
  companyName: "",
  authMethods: ["email"],
  collectableInfos: ["email", "name"],
  hasMarketing: false,
  hasMinor: false,
  hasPayment: false,
  hasThirdPartySharing: false,
};

export const useJoinKitStore = create<JoinKitState>((set) => ({
  currentStep: "service-info",
  setCurrentStep: (step) => set({ currentStep: step }),

  input: { ...defaultInput },
  updateInput: (partial) =>
    set((state) => ({ input: { ...state.input, ...partial } })),
  resetInput: () => set({ input: { ...defaultInput }, currentStep: "service-info", result: null }),

  result: null,
  setResult: (result) => set({ result }),

  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
}));
