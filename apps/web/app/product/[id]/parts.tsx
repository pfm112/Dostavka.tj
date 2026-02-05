"use client";
import Link from "next/link";
import { useAppStore } from "../../../lib/store";

export function AddQtyBar({ product }: { product: { id: number; name: string; price_tjs: number } }) {
  const add = useAppStore((s) => s.add);
  const inc = useAppStore((s) => s.inc);
  const dec = useAppStore((s) => s.dec);
  const item = useAppStore((s) => s.cart.find((x) => x.product_id === product.id));

  return (
    <div className="mt-6 px-3">
      <div className="flex items-center gap-3">
        <button onClick={() => dec(product.id)} className="h-12 w-16 rounded-full bg-indigo-300 text-2xl font-extrabold text-white">-</button>
        <div className="flex-1 text-center text-xl font-extrabold">{item?.qty ?? 1}</div>
        <button onClick={() => (item ? inc(product.id) : add({ product_id: product.id, name: product.name, price_tjs: product.price_tjs }))} className="h-12 w-16 rounded-full bg-indigo-300 text-2xl font-extrabold text-white">+</button>
        <button onClick={() => add({ product_id: product.id, name: product.name, price_tjs: product.price_tjs })} className="h-12 flex-1 rounded-[18px] bg-[var(--brand)] text-xl font-extrabold text-white">
          🛒
        </button>
      </div>
    </div>
  );
}
