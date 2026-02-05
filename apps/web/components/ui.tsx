import React from "react";

export function Pill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className={
        "rounded-full px-4 py-2 text-sm font-semibold " +
        (active ? "bg-[var(--brand)] text-white" : "bg-gray-100 text-gray-500")
      }
    >
      {children}
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[var(--brand)]/90 px-3 py-1 text-xs font-semibold text-white">
      {children}
    </span>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[22px] bg-white shadow-md">{children}</div>;
}

export function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-gray-700">
      {children}
    </button>
  );
}
