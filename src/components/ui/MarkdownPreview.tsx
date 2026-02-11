"use client";

import { cn } from "@/lib/cn";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({
  content,
  className,
}: MarkdownPreviewProps) {
  const renderMarkdown = (md: string): string => {
    return md
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2">$1</h3>'
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-200">$1</h2>'
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>'
      )
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold">$1</strong>'
      )
      .replace(
        /^- (.+)$/gm,
        '<li class="text-gray-700 ml-4 list-disc">$1</li>'
      )
      .replace(
        /^(\d+)\. (.+)$/gm,
        '<li class="text-gray-700 ml-4 list-decimal">$2</li>'
      )
      .replace(/\|(.+)\|/g, (match) => {
        if (match.includes("---")) return "";
        const cells = match
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim());
        const row = cells
          .map(
            (c) =>
              `<td class="px-3 py-2 border border-gray-200 text-body-2">${c}</td>`
          )
          .join("");
        return `<tr>${row}</tr>`;
      })
      .replace(
        /^(?!<[hl]|<li|<tr|<td)(.+)$/gm,
        '<p class="text-gray-700 leading-relaxed mb-2">$1</p>'
      )
      .replace(/\n\n/g, '<div class="mb-4"></div>')
      .replace(
        /※ (.+)/g,
        '<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-body-2 text-yellow-800">$1</div>'
      );
  };

  return (
    <div
      className={cn("prose prose-gray max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
