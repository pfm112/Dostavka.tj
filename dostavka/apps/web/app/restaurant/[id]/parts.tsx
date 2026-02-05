"use client";
import { useAppStore } from "../../../lib/store";

export function AddToCartBtn({ product }: { product: { id: number; name: string; price_tjs: number } }) {
  const add = useAppStore((s) => s.add);
  return (
    <button
      onClick={() => add({ product_id: product.id, name: product.name, price_tjs: product.price_tjs })}
      className="mt-3 w-full rounded-full bg-[var(--brand)] py-3 font-extrabold text-white"
    >
      🛒
    </button>
  );
}
