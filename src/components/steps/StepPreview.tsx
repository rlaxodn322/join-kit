"use client";

import { useJoinKitStore } from "@/store/useJoinKitStore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { generateAll } from "@/lib/generateAll";

const SERVICE_TYPE_LABELS: Record<string, string> = {
  web: "웹 서비스",
  app: "모바일 앱",
  shopping: "쇼핑몰",
  community: "커뮤니티",
  saas: "SaaS",
};

const AUTH_LABELS: Record<string, string> = {
  email: "이메일",
  phone: "휴대폰",
  social_kakao: "카카오",
  social_naver: "네이버",
  social_google: "구글",
  social_apple: "Apple",
};

const INFO_LABELS: Record<string, string> = {
  email: "이메일",
  phone: "휴대전화",
  name: "이름",
  nickname: "닉네임",
  birthdate: "생년월일",
  gender: "성별",
  address: "주소",
  payment: "결제 정보",
  profile_image: "프로필 이미지",
};

export default function StepPreview() {
  const { input, setCurrentStep, setResult, isGenerating, setIsGenerating } =
    useJoinKitStore();

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateAll(input);
      setResult(result);
      setIsGenerating(false);
      setCurrentStep("result");
    }, 800);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-2 text-gray-900 mb-2">
          입력 내용을 확인해 주세요
        </h2>
        <p className="text-body-1 text-gray-500">
          아래 내용으로 약관, 플로우, DB 스키마를 생성합니다
        </p>
      </div>

      <div className="space-y-4">
        <Card variant="outlined" padding="md">
          <h3 className="text-heading-3 text-gray-900 mb-4">서비스 정보</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-body-2 text-gray-500">서비스명</span>
              <span className="text-body-1 font-medium text-gray-900">
                {input.serviceName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-2 text-gray-500">회사명</span>
              <span className="text-body-1 font-medium text-gray-900">
                {input.companyName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-2 text-gray-500">서비스 유형</span>
              <span className="text-body-1 font-medium text-gray-900">
                {SERVICE_TYPE_LABELS[input.serviceType]}
              </span>
            </div>
            {input.serviceUrl && (
              <div className="flex justify-between">
                <span className="text-body-2 text-gray-500">URL</span>
                <span className="text-body-1 font-medium text-gray-900">
                  {input.serviceUrl}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <h3 className="text-heading-3 text-gray-900 mb-4">가입 방식</h3>
          <div className="flex flex-wrap gap-2">
            {input.authMethods.map((m) => (
              <span
                key={m}
                className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-body-2 font-medium"
              >
                {AUTH_LABELS[m]}
              </span>
            ))}
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <h3 className="text-heading-3 text-gray-900 mb-4">수집 정보</h3>
          <div className="flex flex-wrap gap-2">
            {input.collectableInfos.map((info) => (
              <span
                key={info}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-body-2 font-medium"
              >
                {INFO_LABELS[info]}
              </span>
            ))}
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <h3 className="text-heading-3 text-gray-900 mb-4">추가 옵션</h3>
          <div className="space-y-2">
            {[
              { label: "마케팅 수신 동의", value: input.hasMarketing },
              { label: "미성년자 대상", value: input.hasMinor },
              { label: "결제 기능", value: input.hasPayment },
              { label: "제3자 정보 제공", value: input.hasThirdPartySharing },
            ].map((opt) => (
              <div key={opt.label} className="flex justify-between">
                <span className="text-body-2 text-gray-500">{opt.label}</span>
                <span
                  className={`text-body-2 font-medium ${
                    opt.value ? "text-primary-600" : "text-gray-400"
                  }`}
                >
                  {opt.value ? "사용" : "미사용"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <p className="text-caption text-gray-400 text-center">
          생성되는 모든 문서는 참고용 초안이며, 법적 효력을 보장하지 않습니다.
        </p>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setCurrentStep("options")}
            className="flex-1"
          >
            이전
          </Button>
          <Button
            size="lg"
            onClick={handleGenerate}
            loading={isGenerating}
            className="flex-[2]"
          >
            생성하기
          </Button>
        </div>
      </div>
    </div>
  );
}
