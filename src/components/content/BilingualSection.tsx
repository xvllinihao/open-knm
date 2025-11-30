import type { ReactNode } from "react";

type Props = {
  left: ReactNode;
  right: ReactNode;
  className?: string;
};

export function BilingualSection({ left, right, className }: Props) {
  return (
    <div className={`grid gap-8 md:grid-cols-2 ${className ?? ""}`}>
      <section className="space-y-4 prose prose-slate max-w-none">{left}</section>
      <section className="space-y-4 prose prose-slate max-w-none">{right}</section>
    </div>
  );
}


