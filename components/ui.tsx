import type { ButtonHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-baseline justify-between gap-3 text-sm font-medium text-[var(--muted)]">
        {label}
        {hint ? <span className="font-normal text-[var(--faint)]">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

export const fieldClass =
  "w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--faint)] focus:border-[var(--accent)]";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles = {
    primary: "shine bg-[var(--accent)] text-[#1a1308] hover:bg-[var(--accent-hover)]",
    ghost: "border border-[var(--line)] bg-transparent text-[var(--foreground)] hover:border-[var(--accent)]",
    danger: "border border-[#5c2b24] bg-[#2a1613] text-[#f0b4ab] hover:border-[#8a3f35]",
  }[variant];

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClass} min-h-48 font-mono text-[13px] leading-6`} {...props} />;
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[11px] uppercase tracking-wide text-[var(--muted)]">
      {children}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--line)] px-6 py-12 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
    </div>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-[#e38b7d]">{children}</p>;
}
