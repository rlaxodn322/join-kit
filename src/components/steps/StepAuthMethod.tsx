"use client";

import { useJoinKitStore } from "@/store/useJoinKitStore";
import ChipToggle from "@/components/ui/ChipToggle";
import Button from "@/components/ui/Button";
import type { AuthMethod } from "@/types";

const AUTH_OPTIONS: { value: AuthMethod; label: string }[] = [
  { value: "email", label: "이메일" },
  { value: "phone", label: "휴대폰" },
  { value: "social_kakao", label: "카카오" },
  { value: "social_naver", label: "네이버" },
  { value: "social_google", label: "구글" },
  { value: "social_apple", label: "Apple" },
];

export default function StepAuthMethod() {
  const { input, updateInput, setCurrentStep } = useJoinKitStore();

  const toggleAuth = (method: AuthMethod) => {
    const current = input.authMethods;
    if (current.includes(method)) {
      if (current.length > 1) {
        updateInput({ authMethods: current.filter((m) => m !== method) });
      }
    } else {
      updateInput({ authMethods: [...current, method] });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-2 text-gray-900 mb-2">
          회원가입 방식을 선택해 주세요
        </h2>
        <p className="text-body-1 text-gray-500">
          복수 선택이 가능합니다. 최소 1개 이상 선택해야 합니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {AUTH_OPTIONS.map((option) => (
          <ChipToggle
            key={option.value}
            label={option.label}
            selected={input.authMethods.includes(option.value)}
            onToggle={() => toggleAuth(option.value)}
          />
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-body-2 text-gray-600">
          선택된 방식:{" "}
          <span className="font-medium text-gray-900">
            {input.authMethods
              .map((m) => AUTH_OPTIONS.find((o) => o.value === m)?.label)
              .join(", ")}
          </span>
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setCurrentStep("service-info")}
          className="flex-1"
        >
          이전
        </Button>
        <Button
          size="lg"
          onClick={() => setCurrentStep("collect-info")}
          className="flex-[2]"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
