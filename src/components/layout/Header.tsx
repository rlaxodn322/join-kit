"use client";

import { useJoinKitStore } from "@/store/useJoinKitStore";

export default function Header() {
  const { resetInput } = useJoinKitStore();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={resetInput}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="text-heading-3 text-gray-900">JoinKit</span>
        </button>

        <a
          href="https://github.com/rlaxodn322"
          target="_blank"
          rel="noopener noreferrer"
          className="text-body-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
