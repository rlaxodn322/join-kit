"use client";

import { useJoinKitStore } from "@/store/useJoinKitStore";
import ChipToggle from "@/components/ui/ChipToggle";
import Button from "@/components/ui/Button";
import type { CollectableInfo } from "@/types";

const INFO_OPTIONS: {
  value: CollectableInfo;
  label: string;
  description: string;
}[] = [
  { value: "email", label: "이메일", description: "로그인 및 알림 발송" },
  { value: "phone", label: "휴대전화", description: "본인인증 및 알림" },
  { value: "name", label: "이름", description: "본인 확인" },
  { value: "nickname", label: "닉네임", description: "커뮤니티 활동명" },
  { value: "birthdate", label: "생년월일", description: "연령 확인" },
  { value: "gender", label: "성별", description: "통계 및 개인화" },
  { value: "address", label: "주소", description: "배송 및 서비스 제공" },
  { value: "payment", label: "결제 정보", description: "유료 서비스 결제" },
  {
    value: "profile_image",
    label: "프로필 이미지",
    description: "프로필 표시",
  },
];

export default function StepCollectInfo() {
  const { input, updateInput, setCurrentStep } = useJoinKitStore();

  const toggleInfo = (info: CollectableInfo) => {
    const current = input.collectableInfos;
    if (current.includes(info)) {
      updateInput({ collectableInfos: current.filter((i) => i !== info) });
    } else {
      updateInput({ collectableInfos: [...current, info] });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-2 text-gray-900 mb-2">
          어떤 정보를 수집하나요?
        </h2>
        <p className="text-body-1 text-gray-500">
          회원가입 시 수집할 개인정보를 선택해 주세요. 개인정보 최소 수집 원칙에
          따라 꼭 필요한 정보만 선택하세요.
        </p>
      </div>

      <div className="space-y-3">
        {INFO_OPTIONS.map((option) => (
          <div
            key={option.value}
            className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex-1">
              <p className="text-body-1 font-medium text-gray-900">
                {option.label}
              </p>
              <p className="text-body-2 text-gray-500">{option.description}</p>
            </div>
            <ChipToggle
              label={
                input.collectableInfos.includes(option.value)
                  ? "수집"
                  : "미수집"
              }
              selected={input.collectableInfos.includes(option.value)}
              onToggle={() => toggleInfo(option.value)}
            />
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-body-2 text-blue-700">
          개인정보 최소 수집 원칙: 서비스 운영에 반드시 필요한 정보만 수집하세요.
          불필요한 정보 수집은 법적 리스크를 높일 수 있습니다.
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setCurrentStep("auth-method")}
          className="flex-1"
        >
          이전
        </Button>
        <Button
          size="lg"
          onClick={() => setCurrentStep("options")}
          className="flex-[2]"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
