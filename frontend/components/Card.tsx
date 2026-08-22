import React, { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-4 ${className}`}
    >
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-white tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-zinc-400 leading-relaxed">{subtitle}</p>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
