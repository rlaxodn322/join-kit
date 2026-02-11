"use client";

import { cn } from "@/lib/cn";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  labels,
  className,
}: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {labels && (
        <div className="flex justify-between mt-2">
          {labels.map((label, index) => (
            <span
              key={label}
              className={cn(
                "text-caption transition-colors",
                index + 1 <= currentStep
                  ? "text-primary-500 font-medium"
                  : "text-gray-400"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
