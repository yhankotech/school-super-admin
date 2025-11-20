import React from "react";

type BadgeProps = {
  variant?: "destructive" | "secondary" | "success" | string;
  className?: string;
  children?: React.ReactNode;
};

export function Badge({ variant = "secondary", className, children }: BadgeProps) {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-sm font-medium";
  let variantClass = "bg-muted text-foreground";

  if (variant === "destructive") {
    variantClass = "bg-red-600 text-white";
  } else if (variant === "secondary") {
    variantClass = "bg-muted/30 text-foreground";
  } else if (variant === "success") {
    variantClass = "bg-green-600 text-white";
  }

  return (
    <span className={`${base} ${variantClass} ${className || ""}`}>
      {children}
    </span>
  );
}
