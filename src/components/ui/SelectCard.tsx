"use client";

import { cn } from "@/lib/cn";

interface SelectCardProps {
  label: string;
  description?: string;
  icon?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export default function SelectCard({
  label,
  description,
  icon,
  selected,
  onSelect,
  disabled = false,
}: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200",
        selected
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <p
            className={cn(
              "text-body-1 font-semibold",
              selected ? "text-primary-700" : "text-gray-900"
            )}
          >
            {label}
          </p>
          {description && (
            <p className="text-body-2 text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        {selected && (
          <div className="ml-auto">
            <svg
              className="w-6 h-6 text-primary-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
