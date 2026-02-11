"use client";

import { cn } from "@/lib/cn";

interface ChipToggleProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function ChipToggle({
  label,
  selected,
  onToggle,
  disabled = false,
}: ChipToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "inline-flex items-center px-4 py-2.5 rounded-full border-2 text-body-2 font-medium transition-all duration-200",
        selected
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {selected && (
        <svg
          className="w-4 h-4 mr-1.5 text-primary-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {label}
    </button>
  );
}
