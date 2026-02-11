"use client";

import { useJoinKitStore } from "@/store/useJoinKitStore";
import SelectCard from "@/components/ui/SelectCard";
import Button from "@/components/ui/Button";
import type { ServiceType } from "@/types";

const SERVICE_TYPES: {
  value: ServiceType;
  label: string;
  icon: string;
  description: string;
}[] = [
  { value: "web", label: "웹 서비스", icon: "🌐", description: "웹사이트, 웹앱" },
  { value: "app", label: "모바일 앱", icon: "📱", description: "iOS, Android 앱" },
  {
    value: "shopping",
    label: "쇼핑몰",
    icon: "🛒",
    description: "전자상거래, 온라인 스토어",
  },
  {
    value: "community",
    label: "커뮤니티",
    icon: "💬",
    description: "포럼, SNS, 게시판",
  },
  {
    value: "saas",
    label: "SaaS",
    icon: "☁️",
    description: "B2B 클라우드 서비스",
  },
];

export default function StepServiceInfo() {
  const { input, updateInput, setCurrentStep } = useJoinKitStore();

  const canProceed =
    input.serviceName.trim() !== "" && input.companyName.trim() !== "";

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-heading-3 text-gray-900 mb-2">
          서비스 이름
        </label>
        <p className="text-body-2 text-gray-500 mb-3">
          회원가입을 적용할 서비스의 이름을 입력해 주세요
        </p>
        <input
          type="text"
          value={input.serviceName}
          onChange={(e) => updateInput({ serviceName: e.target.value })}
          placeholder="예: 마이서비스"
          className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 text-body-1 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-0 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-heading-3 text-gray-900 mb-2">
          회사(사업자)명
        </label>
        <p className="text-body-2 text-gray-500 mb-3">
          약관에 표시될 회사명입니다
        </p>
        <input
          type="text"
          value={input.companyName}
          onChange={(e) => updateInput({ companyName: e.target.value })}
          placeholder="예: 주식회사 마이컴퍼니"
          className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 text-body-1 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-0 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-heading-3 text-gray-900 mb-2">
          서비스 URL{" "}
          <span className="text-body-2 text-gray-400 font-normal">
            (선택)
          </span>
        </label>
        <input
          type="url"
          value={input.serviceUrl || ""}
          onChange={(e) => updateInput({ serviceUrl: e.target.value })}
          placeholder="https://example.com"
          className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 text-body-1 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-0 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-heading-3 text-gray-900 mb-2">
          서비스 유형
        </label>
        <p className="text-body-2 text-gray-500 mb-3">
          서비스 유형에 따라 약관 내용이 달라집니다
        </p>
        <div className="grid gap-3">
          {SERVICE_TYPES.map((type) => (
            <SelectCard
              key={type.value}
              label={type.label}
              description={type.description}
              icon={type.icon}
              selected={input.serviceType === type.value}
              onSelect={() => updateInput({ serviceType: type.value })}
            />
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button
          fullWidth
          size="lg"
          disabled={!canProceed}
          onClick={() => setCurrentStep("auth-method")}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
