import type { TermsGeneratorInput, GeneratedTerms } from "@/types";

const DISCLAIMER =
  "\n\n※ 본 문서는 참고용 초안이며, 최종 법적 검토는 전문가 확인이 필요합니다.";

function formatDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function getCollectedInfoLabel(info: string): string {
  const map: Record<string, string> = {
    email: "이메일 주소",
    phone: "휴대전화 번호",
    name: "이름(성명)",
    birthdate: "생년월일",
    gender: "성별",
    address: "주소",
    payment: "결제 정보(카드번호, 계좌번호 등)",
    profile_image: "프로필 이미지",
    nickname: "닉네임",
  };
  return map[info] || info;
}

function getAuthMethodLabel(method: string): string {
  const map: Record<string, string> = {
    email: "이메일",
    phone: "휴대전화 번호",
    social_kakao: "카카오 계정",
    social_naver: "네이버 계정",
    social_google: "구글 계정",
    social_apple: "Apple 계정",
  };
  return map[method] || method;
}

function getServiceTypeLabel(type: string): string {
  const map: Record<string, string> = {
    web: "웹 서비스",
    app: "모바일 애플리케이션",
    shopping: "전자상거래(쇼핑몰)",
    community: "커뮤니티 서비스",
    saas: "SaaS(클라우드 서비스)",
  };
  return map[type] || type;
}

// ===== 서비스 이용약관 생성 =====
function generateServiceTerms(input: TermsGeneratorInput): string {
  const today = formatDate(new Date());
  const serviceTypeLabel = getServiceTypeLabel(input.serviceType);

  let terms = `# ${input.serviceName} 서비스 이용약관

시행일: ${today}

## 제1조 (목적)

이 약관은 ${input.companyName}(이하 "회사")이 제공하는 ${input.serviceName} ${serviceTypeLabel}(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

## 제2조 (정의)

1. "서비스"란 회사가 제공하는 ${serviceTypeLabel}을(를) 의미합니다.
2. "이용자"란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 이용할 수 있는 자를 말합니다.

## 제3조 (약관의 효력 및 변경)

1. 이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.
2. 회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 이 약관을 변경할 수 있습니다.
3. 약관이 변경되는 경우 회사는 변경 내용을 시행일 7일 전부터 서비스 내 공지합니다.
4. 변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단하고 탈퇴할 수 있습니다.

## 제4조 (서비스의 제공)

1. 회사는 다음과 같은 서비스를 제공합니다:
   - ${serviceTypeLabel} 관련 제반 서비스
`;

  if (input.hasPayment) {
    terms += `   - 결제 및 구매 관련 서비스\n`;
  }
  if (input.serviceType === "community") {
    terms += `   - 게시물 작성 및 커뮤니티 활동 서비스\n`;
  }
  if (input.serviceType === "shopping") {
    terms += `   - 상품 검색, 주문, 배송 관련 서비스\n`;
  }

  terms += `
2. 서비스는 연중무휴 24시간 제공을 원칙으로 합니다.
3. 회사는 시스템 점검, 장비 교체 등의 사유로 서비스 제공을 일시적으로 중단할 수 있습니다.

## 제5조 (회원가입)

1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 약관에 동의하여 회원가입을 신청합니다.
2. 회사는 다음의 방법으로 본인 확인 및 회원가입을 지원합니다:
${input.authMethods.map((m) => `   - ${getAuthMethodLabel(m)}`).join("\n")}
`;

  if (input.hasMinor) {
    terms += `3. 만 14세 미만의 아동이 회원가입을 하는 경우, 법정대리인의 동의를 받아야 합니다.\n`;
  } else {
    terms += `3. 서비스는 만 14세 이상의 이용자를 대상으로 합니다.\n`;
  }

  terms += `
## 제6조 (회원 탈퇴 및 자격 제한)

1. 회원은 언제든지 서비스 내에서 회원탈퇴를 요청할 수 있으며, 회사는 즉시 처리합니다.
2. 회사는 회원이 다음에 해당하는 경우 사전 통지 없이 자격을 제한 또는 정지시킬 수 있습니다:
   - 가입 신청 시 허위 내용을 등록한 경우
   - 다른 이용자의 서비스 이용을 방해하거나 정보를 도용한 경우
   - 서비스를 이용하여 법령 또는 약관이 금지하는 행위를 한 경우

## 제7조 (개인정보 보호)

회원의 개인정보 보호에 관한 사항은 별도의 "개인정보 처리방침"에 따릅니다.
`;

  if (input.hasPayment) {
    terms += `
## 제8조 (결제)

1. 유료 서비스의 이용 요금 및 결제 방법은 서비스 내에 별도로 안내합니다.
2. 회사는 결제 과정에서 이용자의 결제 정보를 안전하게 처리하기 위해 PG사(결제대행업체)를 통해 처리합니다.
3. 환불 정책은 관련 법령 및 회사 정책에 따릅니다.
`;
  }

  terms += `
## 제${input.hasPayment ? 9 : 8}조 (면책 조항)

1. 회사는 천재지변 등 불가항력으로 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.
2. 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.

## 제${input.hasPayment ? 10 : 9}조 (분쟁 해결)

1. 서비스 이용과 관련하여 분쟁이 발생한 경우 회사와 이용자는 상호 협의하여 해결합니다.
2. 협의가 이루어지지 않는 경우 관할 법원에 소를 제기할 수 있습니다.

## 부칙

이 약관은 ${today}부터 시행됩니다.`;

  return terms + DISCLAIMER;
}

// ===== 개인정보 처리방침 생성 =====
function generatePrivacyPolicy(input: TermsGeneratorInput): string {
  const today = formatDate(new Date());
  const collectedItems = input.collectableInfos
    .map((info) => getCollectedInfoLabel(info))
    .join(", ");

  let retentionPeriod = "회원 탈퇴 시까지";
  if (input.hasPayment) {
    retentionPeriod += " (단, 전자상거래법에 따라 거래 기록은 5년간 보관)";
  }

  let policy = `# ${input.serviceName} 개인정보 처리방침

시행일: ${today}

${input.companyName}(이하 "회사")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하고 있습니다.

## 1. 수집하는 개인정보 항목

### 필수 수집 항목
- ${collectedItems}

### 서비스 이용 과정에서 자동 수집되는 항목
- 접속 IP 주소, 접속 일시, 서비스 이용 기록, 기기 정보(OS, 브라우저 종류)
- 쿠키(Cookie) 정보
`;

  if (input.authMethods.some((m) => m.startsWith("social_"))) {
    policy += `
### 소셜 로그인 시 수집 항목
${input.authMethods
  .filter((m) => m.startsWith("social_"))
  .map((m) => `- ${getAuthMethodLabel(m)}: 고유 식별자, 이메일, 프로필 정보(닉네임, 프로필 이미지)`)
  .join("\n")}
`;
  }

  policy += `
## 2. 개인정보의 수집 및 이용 목적

- 회원가입 및 본인 확인
- 서비스 제공 및 운영
- 서비스 개선 및 신규 서비스 개발
- 불법 및 부정 이용 방지
`;

  if (input.hasPayment) {
    policy += `- 결제 처리 및 환불\n- 거래 내역 관리\n`;
  }
  if (input.hasMarketing) {
    policy += `- 마케팅 및 광고 활용 (별도 동의 시)\n`;
  }

  policy += `
## 3. 개인정보의 보유 및 이용 기간

- **원칙**: ${retentionPeriod}
- 회원 탈퇴 시 지체 없이 파기합니다.
`;

  if (input.hasPayment) {
    policy += `
### 법령에 따른 보존 기간
| 보존 항목 | 보존 기간 | 근거 법령 |
|-----------|-----------|-----------|
| 계약 또는 청약철회 기록 | 5년 | 전자상거래법 |
| 대금결제 및 재화 공급 기록 | 5년 | 전자상거래법 |
| 소비자 불만 또는 분쟁 처리 기록 | 3년 | 전자상거래법 |
| 표시/광고에 관한 기록 | 6개월 | 전자상거래법 |
| 로그인 기록 | 3개월 | 통신비밀보호법 |
`;
  }

  policy += `
## 4. 개인정보의 파기 절차 및 방법

1. **파기 절차**: 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.
2. **파기 방법**:
   - 전자적 파일: 복원이 불가능한 방법으로 영구 삭제
   - 종이 문서: 분쇄기로 분쇄 또는 소각

## 5. 개인정보의 제3자 제공

`;

  if (input.hasThirdPartySharing) {
    policy += `회사는 이용자의 동의를 받은 경우 또는 법령에 규정된 경우를 제외하고는 개인정보를 제3자에게 제공하지 않습니다.

제3자 제공이 필요한 경우, 제공받는 자, 목적, 항목, 보유 기간을 사전에 안내하고 별도 동의를 받습니다.`;
  } else {
    policy += `회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 의해 요구되는 경우는 예외로 합니다.`;
  }

  policy += `

## 6. 개인정보의 안전성 확보 조치

회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취합니다:
- 개인정보의 암호화 (비밀번호, 고유식별정보 등)
- 해킹 등에 대비한 기술적 대책
- 개인정보 접근 권한 제한
- 개인정보 취급 직원의 교육

## 7. 이용자의 권리와 행사 방법

1. 이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있습니다.
2. 이용자는 회원탈퇴를 통해 개인정보의 처리 정지를 요청할 수 있습니다.
3. 이용자는 개인정보 처리에 대한 동의를 철회할 수 있습니다.
`;

  if (input.hasMinor) {
    policy += `
## 8. 아동의 개인정보 보호

- 만 14세 미만 아동의 개인정보 수집 시 법정대리인의 동의를 받습니다.
- 법정대리인은 아동의 개인정보에 대한 열람, 수정, 삭제를 요청할 수 있습니다.
`;
  }

  policy += `
## ${input.hasMinor ? 9 : 8}. 개인정보 보호책임자

- 성명: [담당자명]
- 직책: [직책]
- 연락처: [이메일/전화번호]

## ${input.hasMinor ? 10 : 9}. 개인정보 처리방침 변경

이 개인정보 처리방침은 ${today}부터 적용됩니다.
변경 사항이 있을 경우 시행 7일 전에 서비스 내 공지합니다.`;

  return policy + DISCLAIMER;
}

// ===== 마케팅 수신 동의 문구 =====
function generateMarketingConsent(input: TermsGeneratorInput): string {
  return `# 마케팅 정보 수신 동의 (선택)

${input.companyName}에서 제공하는 ${input.serviceName}의 이벤트, 혜택, 신규 서비스 등의 정보를 받아보실 수 있습니다.

## 수신 항목
${input.collectableInfos.includes("email") ? "- 이메일을 통한 마케팅 정보 수신\n" : ""}${input.collectableInfos.includes("phone") ? "- SMS/알림톡을 통한 마케팅 정보 수신\n" : ""}- 앱 푸시 알림을 통한 마케팅 정보 수신

## 안내 사항
- 마케팅 정보 수신 동의는 **선택**이며, 동의하지 않아도 서비스 이용이 가능합니다.
- 동의 후에도 서비스 내 설정에서 언제든지 수신을 거부할 수 있습니다.
- 수신 동의 철회 시 마케팅 목적의 연락은 즉시 중단됩니다.

${DISCLAIMER}`;
}

// ===== 메인 생성 함수 =====
export function generateTerms(input: TermsGeneratorInput): GeneratedTerms {
  const now = new Date();
  return {
    serviceTerms: generateServiceTerms(input),
    privacyPolicy: generatePrivacyPolicy(input),
    marketingConsent: input.hasMarketing
      ? generateMarketingConsent(input)
      : undefined,
    generatedAt: now.toISOString(),
    version: `v1.0.0-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`,
  };
}
