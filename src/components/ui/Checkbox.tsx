"use client";

import { cn } from "@/lib/cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
  tag?: string;
  tagColor?: "blue" | "gray";
  onViewDetail?: () => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, description, tag, tagColor = "blue", onViewDetail, ...props },
    ref
  ) => {
    const tagColors = {
      blue: "bg-primary-50 text-primary-600",
      gray: "bg-gray-100 text-gray-500",
    };

    return (
      <label
        className={cn(
          "flex items-start gap-3 py-3 cursor-pointer select-none group",
          className
        )}
      >
        <div className="flex items-center pt-0.5">
          <input
            ref={ref}
            type="checkbox"
            className="w-5 h-5 rounded-md border-2 border-gray-300 text-primary-500 focus:ring-primary-300 focus:ring-2 transition-colors cursor-pointer accent-[#3182F6]"
            {...props}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {tag && (
              <span
                className={cn(
                  "inline-flex px-2 py-0.5 rounded-md text-caption font-medium",
                  tagColors[tagColor]
                )}
              >
                {tag}
              </span>
            )}
            <span className="text-body-1 text-gray-900 group-hover:text-gray-700">
              {label}
            </span>
          </div>
          {description && (
            <p className="text-body-2 text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        {onViewDetail && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewDetail();
            }}
            className="text-body-2 text-gray-400 hover:text-primary-500 underline shrink-0 pt-0.5"
          >
            보기
          </button>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
