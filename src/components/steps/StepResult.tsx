"use client";

import { useState } from "react";
import { useJoinKitStore } from "@/store/useJoinKitStore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CodeBlock from "@/components/ui/CodeBlock";
import MarkdownPreview from "@/components/ui/MarkdownPreview";
import { cn } from "@/lib/cn";

type ResultTab =
  | "terms"
  | "privacy"
  | "marketing"
  | "flow"
  | "mermaid"
  | "schema"
  | "retention";

interface TabItem {
  id: ResultTab;
  label: string;
  show: boolean;
}

export default function StepResult() {
  const { result, resetInput } = useJoinKitStore();
  const [activeTab, setActiveTab] = useState<ResultTab>("terms");

  if (!result) return null;

  const tabs: TabItem[] = [
    { id: "terms", label: "이용약관", show: true },
    { id: "privacy", label: "개인정보 처리방침", show: true },
    {
      id: "marketing",
      label: "마케팅 동의",
      show: !!result.terms.marketingConsent,
    },
    { id: "flow", label: "가입 플로우", show: true },
    { id: "mermaid", label: "플로우 다이어그램", show: true },
    { id: "schema", label: "DB 스키마", show: true },
    { id: "retention", label: "보관/삭제 정책", show: true },
  ].filter((t) => t.show);

  const handleDownloadAll = () => {
    const blob = new Blob(
      [
        `=== ${result.input.serviceName} - JoinKit 생성 결과 ===\n`,
        `생성일: ${result.terms.generatedAt}\n`,
        `버전: ${result.terms.version}\n\n`,
        `${"=".repeat(60)}\n`,
        `[서비스 이용약관]\n`,
        `${"=".repeat(60)}\n\n`,
        result.terms.serviceTerms,
        `\n\n${"=".repeat(60)}\n`,
        `[개인정보 처리방침]\n`,
        `${"=".repeat(60)}\n\n`,
        result.terms.privacyPolicy,
        result.terms.marketingConsent
          ? `\n\n${"=".repeat(60)}\n[마케팅 수신 동의]\n${"=".repeat(60)}\n\n${result.terms.marketingConsent}`
          : "",
        `\n\n${"=".repeat(60)}\n`,
        `[DB 스키마 SQL]\n`,
        `${"=".repeat(60)}\n\n`,
        result.schema.sql,
        `\n\n${"=".repeat(60)}\n`,
        `[보관 및 삭제 정책]\n`,
        `${"=".repeat(60)}\n\n`,
        result.schema.retentionPolicy,
        `\n\n${"=".repeat(60)}\n`,
        `[Mermaid 플로우 다이어그램]\n`,
        `${"=".repeat(60)}\n\n`,
        result.flow.mermaidDiagram,
      ],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `joinkit-${result.input.serviceName}-${result.terms.version}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySQL = async () => {
    await navigator.clipboard.writeText(result.schema.sql);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-2 text-gray-900">생성 완료</h2>
          <p className="text-body-2 text-gray-500 mt-1">
            {result.input.serviceName} &middot; {result.terms.version}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleDownloadAll}>
            전체 다운로드
          </Button>
          <Button variant="ghost" size="sm" onClick={resetInput}>
            새로 만들기
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-body-2 text-yellow-800">
          ⚠️ 본 문서는 참고용 초안이며, 최종 법적 검토는 전문가 확인이
          필요합니다.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-body-2 font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card variant="default" padding="lg">
        {activeTab === "terms" && (
          <MarkdownPreview content={result.terms.serviceTerms} />
        )}

        {activeTab === "privacy" && (
          <MarkdownPreview content={result.terms.privacyPolicy} />
        )}

        {activeTab === "marketing" && result.terms.marketingConsent && (
          <MarkdownPreview content={result.terms.marketingConsent} />
        )}

        {activeTab === "flow" && (
          <div className="space-y-6">
            <h3 className="text-heading-3 text-gray-900">
              회원가입 플로우 ({result.flow.totalSteps}단계)
            </h3>

            {/* Steps */}
            <div className="space-y-4">
              {result.flow.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-body-2 font-bold">
                      {step.order}
                    </div>
                    {idx < result.flow.steps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <h4 className="text-body-1 font-semibold text-gray-900">
                      {step.title}
                    </h4>
                    <p className="text-body-2 text-gray-500 mt-1">
                      {step.description}
                    </p>

                    {/* Agreements */}
                    {step.agreements && (
                      <div className="mt-3 space-y-2">
                        {step.agreements.map((ag) => (
                          <div
                            key={ag.id}
                            className="flex items-center gap-2 text-body-2"
                          >
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-caption font-medium",
                                ag.required
                                  ? "bg-red-50 text-red-600"
                                  : "bg-gray-100 text-gray-500"
                              )}
                            >
                              {ag.required ? "필수" : "선택"}
                            </span>
                            <span className="text-gray-700">{ag.title}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fields */}
                    {step.fields && (
                      <div className="mt-3 space-y-2">
                        {step.fields.map((field) => (
                          <div
                            key={field.name}
                            className="flex items-center gap-2 text-body-2"
                          >
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-caption font-medium",
                                field.required
                                  ? "bg-red-50 text-red-600"
                                  : "bg-gray-100 text-gray-500"
                              )}
                            >
                              {field.required ? "필수" : "선택"}
                            </span>
                            <span className="text-gray-700">{field.label}</span>
                            {field.validation && (
                              <span className="text-gray-400">
                                ({field.validation})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* UX Recommendations */}
            <div className="mt-8">
              <h4 className="text-heading-3 text-gray-900 mb-3">
                UX 권장사항
              </h4>
              <div className="space-y-2">
                {result.flow.uxRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 bg-blue-50 rounded-xl"
                  >
                    <span className="text-primary-500 font-bold text-body-2 shrink-0">
                      {idx + 1}.
                    </span>
                    <p className="text-body-2 text-blue-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "mermaid" && (
          <div className="space-y-4">
            <h3 className="text-heading-3 text-gray-900">
              Mermaid 플로우 다이어그램
            </h3>
            <p className="text-body-2 text-gray-500">
              아래 코드를 Mermaid 뷰어에 붙여넣으면 시각적 다이어그램을 확인할
              수 있습니다.
            </p>
            <CodeBlock
              code={result.flow.mermaidDiagram}
              language="mermaid"
              title="signup-flow.mmd"
            />
          </div>
        )}

        {activeTab === "schema" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-heading-3 text-gray-900">DB 스키마</h3>
              <Button variant="ghost" size="sm" onClick={handleCopySQL}>
                SQL 복사
              </Button>
            </div>
            <p className="text-body-2 text-gray-500">
              {result.schema.description}
            </p>

            {/* Table list */}
            <div className="space-y-3 mb-6">
              {result.schema.tables.map((table) => (
                <div
                  key={table.name}
                  className="p-4 bg-gray-50 rounded-xl"
                >
                  <p className="text-body-1 font-semibold text-gray-900">
                    {table.name}
                  </p>
                  <p className="text-body-2 text-gray-500">
                    {table.description}
                  </p>
                  <p className="text-caption text-gray-400 mt-1">
                    {table.columns.length}개 컬럼
                  </p>
                </div>
              ))}
            </div>

            <CodeBlock
              code={result.schema.sql}
              language="sql"
              title="schema.sql"
            />
          </div>
        )}

        {activeTab === "retention" && (
          <div className="space-y-4">
            <h3 className="text-heading-3 text-gray-900">
              보관 및 삭제 정책
            </h3>
            <MarkdownPreview content={result.schema.retentionPolicy} />
          </div>
        )}
      </Card>
    </div>
  );
}
