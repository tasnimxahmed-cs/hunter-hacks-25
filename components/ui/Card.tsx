import { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-xl border shadow-sm bg-white ${className}`}>{children}</div>;
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}