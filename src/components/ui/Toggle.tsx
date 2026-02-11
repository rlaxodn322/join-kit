"use client";

import { cn } from "@/lib/cn";

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 mr-4">
        <p className="text-body-1 text-gray-900 font-medium">{label}</p>
        {description && (
          <p className="text-body-2 text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300",
          checked ? "bg-primary-500" : "bg-gray-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}
