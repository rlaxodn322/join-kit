"use client";

import { useJoinKitStore } from "@/store/useJoinKitStore";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";

export default function StepOptions() {
  const { input, updateInput, setCurrentStep } = useJoinKitStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-2 text-gray-900 mb-2">
          추가 옵션을 설정해 주세요
        </h2>
        <p className="text-body-1 text-gray-500">
          서비스에 필요한 옵션을 설정합니다
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        <Toggle
          label="마케팅 수신 동의"
          description="이메일, SMS, 푸시 알림 등 마케팅 정보 수신 동의를 받습니다. (선택 동의)"
          checked={input.hasMarketing}
          onChange={(v) => updateInput({ hasMarketing: v })}
        />

        <Toggle
          label="미성년자 대상 서비스"
          description="만 14세 미만 이용자가 사용할 수 있는 서비스입니다. 법정대리인 동의 절차가 추가됩니다."
          checked={input.hasMinor}
          onChange={(v) => updateInput({ hasMinor: v })}
        />

        <Toggle
          label="결제 기능"
          description="유료 서비스, 인앱 결제, 쇼핑 등 결제 기능이 포함된 서비스입니다."
          checked={input.hasPayment}
          onChange={(v) => updateInput({ hasPayment: v })}
        />

        <Toggle
          label="개인정보 제3자 제공"
          description="수집한 개인정보를 제3자(파트너사, 제휴사 등)에게 제공하는 경우입니다."
          checked={input.hasThirdPartySharing}
          onChange={(v) => updateInput({ hasThirdPartySharing: v })}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setCurrentStep("collect-info")}
          className="flex-1"
        >
          이전
        </Button>
        <Button
          size="lg"
          onClick={() => setCurrentStep("preview")}
          className="flex-[2]"
        >
          미리보기
        </Button>
      </div>
    </div>
  );
}
