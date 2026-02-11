"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export default function CodeBlock({
  code,
  language = "sql",
  title,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden border border-gray-200",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          {title && (
            <span className="text-caption text-gray-500 ml-2">{title}</span>
          )}
          <span className="text-caption text-gray-400 uppercase">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-caption text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
        >
          {copied ? "복사됨!" : "복사"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <pre className="p-4 text-body-2 bg-gray-900 text-gray-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
