import type {
  TermsGeneratorInput,
  SignupFlow,
  SignupStep,
  AgreementItem,
  FormField,
} from "@/types";

function buildAgreements(input: TermsGeneratorInput): AgreementItem[] {
  const agreements: AgreementItem[] = [
    {
      id: "service_terms",
      title: "서비스 이용약관 동의",
      required: true,
      description: `${input.serviceName} 서비스 이용을 위한 약관입니다.`,
      fullTextAvailable: true,
    },
    {
      id: "privacy_policy",
      title: "개인정보 수집 및 이용 동의",
      required: true,
      description: "회원가입에 필요한 개인정보 수집 및 이용에 동의합니다.",
      fullTextAvailable: true,
    },
  ];

  if (input.hasMinor) {
    agreements.push({
      id: "minor_consent",
      title: "만 14세 이상 확인",
      required: true,
      description: "만 14세 이상임을 확인합니다.",
      fullTextAvailable: false,
    });
  }

  if (input.hasThirdPartySharing) {
    agreements.push({
      id: "third_party",
      title: "개인정보 제3자 제공 동의",
      required: true,
      description: "서비스 운영을 위해 필요한 제3자 정보 제공에 동의합니다.",
      fullTextAvailable: true,
    });
  }

  if (input.hasMarketing) {
    agreements.push({
      id: "marketing",
      title: "마케팅 정보 수신 동의",
      required: false,
      description:
        "이벤트, 혜택, 신규 서비스 등 마케팅 정보를 수신합니다. (선택)",
      fullTextAvailable: true,
    });
  }

  return agreements;
}

function buildFormFields(input: TermsGeneratorInput): FormField[] {
  const fields: FormField[] = [];

  // 인증 방식에 따른 필드
  if (input.authMethods.includes("email")) {
    fields.push({
      name: "email",
      label: "이메일",
      type: "email",
      required: true,
      placeholder: "example@email.com",
      validation: "이메일 형식",
    });
    fields.push({
      name: "password",
      label: "비밀번호",
      type: "password",
      required: true,
      placeholder: "8자 이상, 영문+숫자+특수문자",
      validation: "8자 이상, 영문/숫자/특수문자 포함",
    });
    fields.push({
      name: "password_confirm",
      label: "비밀번호 확인",
      type: "password",
      required: true,
      placeholder: "비밀번호를 다시 입력해 주세요",
      validation: "비밀번호 일치 확인",
    });
  }

  // 수집 정보에 따른 필드
  input.collectableInfos.forEach((info) => {
    if (info === "email" && input.authMethods.includes("email")) return; // 이미 추가됨

    switch (info) {
      case "name":
        fields.push({
          name: "name",
          label: "이름",
          type: "text",
          required: true,
          placeholder: "홍길동",
        });
        break;
      case "phone":
        fields.push({
          name: "phone",
          label: "휴대전화 번호",
          type: "tel",
          required: input.authMethods.includes("phone"),
          placeholder: "010-0000-0000",
          validation: "휴대전화 번호 형식",
        });
        break;
      case "nickname":
        fields.push({
          name: "nickname",
          label: "닉네임",
          type: "text",
          required: false,
          placeholder: "사용할 닉네임을 입력해 주세요",
          validation: "2~20자, 특수문자 불가",
        });
        break;
      case "birthdate":
        fields.push({
          name: "birthdate",
          label: "생년월일",
          type: "date",
          required: input.hasMinor,
          placeholder: "YYYY-MM-DD",
        });
        break;
      case "gender":
        fields.push({
          name: "gender",
          label: "성별",
          type: "select",
          required: false,
          placeholder: "선택해 주세요",
        });
        break;
      case "address":
        fields.push({
          name: "address",
          label: "주소",
          type: "text",
          required: input.serviceType === "shopping",
          placeholder: "주소 검색",
        });
        break;
    }
  });

  return fields;
}

function buildMermaidDiagram(input: TermsGeneratorInput): string {
  const hasSocial = input.authMethods.some((m) => m.startsWith("social_"));
  const hasEmailAuth = input.authMethods.includes("email");
  const hasPhoneAuth = input.authMethods.includes("phone");

  let diagram = `graph TD
    A[서비스 접속] --> B[회원가입 시작]
    B --> C{가입 방식 선택}
`;

  if (hasEmailAuth) {
    diagram += `    C -->|이메일| D1[약관 동의 화면]
    D1 --> D1A{필수 약관 전체 동의?}
    D1A -->|No| D1[약관 동의 화면]
    D1A -->|Yes| E1[이메일/비밀번호 입력]
    E1 --> F1[이메일 인증]
    F1 --> G[추가 정보 입력]
`;
  }

  if (hasPhoneAuth) {
    diagram += `    C -->|휴대폰| D2[약관 동의 화면]
    D2 --> D2A{필수 약관 전체 동의?}
    D2A -->|No| D2[약관 동의 화면]
    D2A -->|Yes| E2[본인인증 - 휴대폰]
    E2 --> G[추가 정보 입력]
`;
  }

  if (hasSocial) {
    const socialMethods = input.authMethods.filter((m) => m.startsWith("social_"));
    diagram += `    C -->|소셜 로그인| D3[약관 동의 화면]
    D3 --> D3A{필수 약관 전체 동의?}
    D3A -->|No| D3[약관 동의 화면]
    D3A -->|Yes| E3{소셜 서비스 선택}
`;
    socialMethods.forEach((m, i) => {
      const label = m.replace("social_", "").charAt(0).toUpperCase() + m.replace("social_", "").slice(1);
      diagram += `    E3 -->|${label}| F3_${i}[${label} OAuth 인증]
    F3_${i} --> G[추가 정보 입력]
`;
    });
  }

  diagram += `    G --> H{필수 정보 입력 완료?}
    H -->|No| G
    H -->|Yes| I[가입 완료]
    I --> J[환영 화면]
`;

  if (input.hasMarketing) {
    diagram += `
    style D1 fill:#EBF2FE,stroke:#3182F6
    style D2 fill:#EBF2FE,stroke:#3182F6
    style D3 fill:#EBF2FE,stroke:#3182F6
`;
  }

  return diagram;
}

function buildUXRecommendations(input: TermsGeneratorInput): string[] {
  const recommendations: string[] = [
    "한 화면에 하나의 질문/단계만 표시하여 인지 부하를 줄이세요.",
    "약관 동의 화면에서 '전체 동의' 체크박스를 최상단에 배치하되, 개별 동의 항목도 명확히 표시하세요.",
    "필수 약관과 선택 약관은 시각적으로 구분하세요 (예: [필수], [선택] 태그).",
    "약관 전문은 새 화면이 아닌 바텀시트(Bottom Sheet)나 모달로 표시하여 이탈을 방지하세요.",
    "비밀번호 입력 시 실시간 유효성 검사 결과를 표시하세요.",
    "가입 완료 화면에서 다음 행동(서비스 둘러보기, 프로필 설정 등)을 안내하세요.",
    "모바일 환경에서 입력 필드 포커스 시 키보드가 올라와도 '다음' 버튼이 보이도록 하세요.",
    "진행률 표시(Progress Bar)를 상단에 배치하여 전체 단계를 파악할 수 있게 하세요.",
  ];

  if (input.authMethods.some((m) => m.startsWith("social_"))) {
    recommendations.push(
      "소셜 로그인 버튼은 각 플랫폼의 공식 디자인 가이드라인을 따르세요 (카카오: 노란색, 네이버: 초록색 등)."
    );
  }

  if (input.hasMarketing) {
    recommendations.push(
      "마케팅 수신 동의는 반드시 '선택'임을 명확히 표시하고, 미동의 시에도 가입이 진행되어야 합니다."
    );
  }

  if (input.hasPayment) {
    recommendations.push(
      "결제 정보 입력은 가입 과정이 아닌, 실제 결제 시점에 수집하는 것을 권장합니다."
    );
  }

  if (input.hasMinor) {
    recommendations.push(
      "만 14세 미만 이용자의 경우 법정대리인 동의 절차를 별도로 구성하세요."
    );
  }

  return recommendations;
}

// ===== 메인 생성 함수 =====
export function generateFlow(input: TermsGeneratorInput): SignupFlow {
  const agreements = buildAgreements(input);
  const fields = buildFormFields(input);

  const steps: SignupStep[] = [
    {
      order: 1,
      title: "약관 동의",
      description:
        "서비스 이용에 필요한 약관에 동의합니다. 필수 약관에 모두 동의해야 다음 단계로 진행할 수 있습니다.",
      screenType: "agreement",
      agreements,
    },
    {
      order: 2,
      title: "본인 인증",
      description: `${input.authMethods.map((m) => {
        const map: Record<string, string> = {
          email: "이메일",
          phone: "휴대전화",
          social_kakao: "카카오",
          social_naver: "네이버",
          social_google: "구글",
          social_apple: "Apple",
        };
        return map[m] || m;
      }).join(", ")}을(를) 통해 본인 인증을 진행합니다.`,
      screenType: "verification",
    },
    {
      order: 3,
      title: "정보 입력",
      description: "서비스 이용에 필요한 정보를 입력합니다.",
      screenType: "input",
      fields,
    },
    {
      order: 4,
      title: "가입 완료",
      description:
        "회원가입이 완료되었습니다. 서비스를 시작할 수 있습니다.",
      screenType: "complete",
    },
  ];

  return {
    steps,
    totalSteps: steps.length,
    mermaidDiagram: buildMermaidDiagram(input),
    uxRecommendations: buildUXRecommendations(input),
  };
}
