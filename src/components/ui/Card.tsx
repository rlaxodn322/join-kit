"use client";

import { cn } from "@/lib/cn";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  padding?: "sm" | "md" | "lg";
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-white border border-gray-200",
      outlined: "bg-white border-2 border-gray-300",
      elevated: "bg-white shadow-card",
    };

    const paddings = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-200",
          variants[variant],
          paddings[padding],
          hoverable &&
            "cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
