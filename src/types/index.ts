// ===== 서비스 유형 =====
export type ServiceType = "web" | "app" | "shopping" | "community" | "saas";

export type AuthMethod = "email" | "phone" | "social_kakao" | "social_naver" | "social_google" | "social_apple";

export type CollectableInfo =
  | "email"
  | "phone"
  | "name"
  | "birthdate"
  | "gender"
  | "address"
  | "payment"
  | "profile_image"
  | "nickname";

// ===== 약관 생성기 입력 =====
export interface TermsGeneratorInput {
  serviceName: string;
  serviceType: ServiceType;
  serviceUrl?: string;
  companyName: string;
  authMethods: AuthMethod[];
  collectableInfos: CollectableInfo[];
  hasMarketing: boolean;
  hasMinor: boolean; // 미성년자 대상 여부
  hasPayment: boolean;
  hasThirdPartySharing: boolean;
}

// ===== 약관 출력 =====
export interface GeneratedTerms {
  serviceTerms: string; // 서비스 이용약관
  privacyPolicy: string; // 개인정보 처리방침
  marketingConsent?: string; // 마케팅 수신 동의
  generatedAt: string;
  version: string;
}

// ===== 회원가입 플로우 =====
export interface SignupStep {
  order: number;
  title: string;
  description: string;
  screenType: "agreement" | "verification" | "input" | "complete" | "welcome";
  fields?: FormField[];
  agreements?: AgreementItem[];
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "password" | "select" | "date";
  required: boolean;
  placeholder?: string;
  validation?: string;
}

export interface AgreementItem {
  id: string;
  title: string;
  required: boolean;
  description: string;
  fullTextAvailable: boolean;
}

export interface SignupFlow {
  steps: SignupStep[];
  totalSteps: number;
  mermaidDiagram: string;
  uxRecommendations: string[];
}

// ===== DB 스키마 =====
export interface DBColumn {
  name: string;
  type: string;
  nullable: boolean;
  description: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  defaultValue?: string;
}

export interface DBTable {
  name: string;
  description: string;
  columns: DBColumn[];
}

export interface DBSchema {
  tables: DBTable[];
  sql: string;
  description: string;
  retentionPolicy: string;
}

// ===== 전체 결과 =====
export interface JoinKitResult {
  input: TermsGeneratorInput;
  terms: GeneratedTerms;
  flow: SignupFlow;
  schema: DBSchema;
}

// ===== UI 스텝 관리 =====
export type WizardStep =
  | "service-info"
  | "auth-method"
  | "collect-info"
  | "options"
  | "preview"
  | "result";
