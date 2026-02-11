import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JoinKit - 회원가입 스타터 키트",
  description:
    "약관 생성, 회원가입 플로우 설계, DB 스키마까지 한 번에. 1인 개발자를 위한 회원가입 올인원 도구.",
  keywords: [
    "회원가입",
    "약관 생성",
    "개인정보 처리방침",
    "DB 스키마",
    "스타트업",
    "MVP",
  ],
  openGraph: {
    title: "JoinKit - 회원가입 스타터 키트",
    description: "약관 생성, 회원가입 플로우 설계, DB 스키마까지 한 번에",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
