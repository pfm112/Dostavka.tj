"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Рестораны", icon: "☕" },
  { href: "/cart", label: "Корзина", icon: "🛒" },
  { href: "/orders", label: "Заказы", icon: "💬" },
  { href: "/profile", label: "Профиль", icon: "👤" },
];

export function BottomNav() {
  const p = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-[430px] border-t bg-[var(--brand)] text-white">
      <div className="grid grid-cols-4">
        {items.map((it) => {
          const active = p === it.href;
          return (
            <Link key={it.href} href={it.href} className="py-2 text-center">
              <div className={"text-lg leading-none " + (active ? "opacity-100" : "opacity-80")}>{it.icon}</div>
              <div className={"text-[11px] " + (active ? "font-semibold" : "")}>{it.label}</div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
