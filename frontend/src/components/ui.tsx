import React from "react";

// Category badge
export function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    Technical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Social: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    Creative: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Personal Development": "bg-green-500/10 text-green-400 border-green-500/20",
    Professional: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Financial: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Travel: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Miscellaneous: "bg-stone-500/10 text-stone-400 border-stone-500/20",
    Others: "bg-stone-500/10 text-stone-400 border-stone-500/20",
  };
  const cls = colors[category] || colors.Others;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {category}
    </span>
  );
}

// Input
export function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-stone-400">{label}</label>}
      <input
        {...props}
        className={`w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all text-sm ${props.className || ""}`}
      />
    </div>
  );
}

// Textarea
export function Textarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-stone-400">{label}</label>}
      <textarea
        {...props}
        className={`w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all text-sm resize-none ${props.className || ""}`}
      />
    </div>
  );
}

// Select
export function Select({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-stone-400">{label}</label>}
      <select
        {...props}
        className={`w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all text-sm appearance-none cursor-pointer ${props.className || ""}`}
      >
        {children}
      </select>
    </div>
  );
}

// Button
export function Button({
  variant = "primary",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const variants = {
    primary: "bg-amber-400 text-stone-950 hover:bg-amber-300 font-medium",
    secondary: "bg-stone-800 text-stone-100 hover:bg-stone-700 border border-stone-700",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
    ghost: "text-stone-400 hover:text-stone-100 hover:bg-stone-800",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${props.className || ""}`}
    >
      {children}
    </button>
  );
}

// Card
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-stone-900 border border-stone-800 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

// Pagination
export function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-3 justify-center mt-8">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
      >
        ← Prev
      </button>
      <span className="text-stone-500 text-sm font-medium">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
      >
        Next →
      </button>
    </div>
  );
}

// Empty state
export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-stone-800 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-stone-300 mb-1">{title}</h3>
      <p className="text-stone-500 text-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

// Skeleton
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-stone-800 rounded-xl ${className}`} />;
}

// Page header
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif text-3xl text-stone-100">{title}</h1>
        {subtitle && <p className="text-stone-500 mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// CATEGORIES
export const CATEGORIES = [
  "Technical", "Social", "Creative", "Personal Development",
  "Professional", "Financial", "Travel", "Miscellaneous", "Others",
];
