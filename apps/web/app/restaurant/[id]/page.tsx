import Link from "next/link";
import { apiGet } from "../../../lib/api";
import { BottomNav } from "../../../components/BottomNav";
import { Pill, Card } from "../../../components/ui";
import { AddToCartBtn } from "./parts";

type Restaurant = { id: number; name: string; cuisine: string; rating: number; eta_min: number; eta_max: number; min_order_tjs: number; free_delivery: boolean; discount_text?: string | null; cashback_text?: string | null; };
type Product = { id: number; name: string; description: string; price_tjs: number; };

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const r = await apiGet<Restaurant>(`/restaurants/${id}`);
  const products = await apiGet<Product[]>(`/restaurants/${id}/products`);

  return (
    <div className="pb-28">
      <div className="bg-indigo-200 p-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-full bg-white/70 px-4 py-2 font-semibold">←</Link>
          <div className="flex-1" />
          <div className="rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white">1</div>
        </div>

        <Card>
          <div className="flex gap-3 p-3">
            <div className="h-16 w-24 rounded-[18px] bg-gray-200" />
            <div className="flex-1">
              <div className="text-xl font-extrabold">{r.name}</div>
              <div className="text-sm text-gray-500">{r.cuisine}</div>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-600">
                <span>🕒 {r.eta_min}-{r.eta_max} мин.</span>
                <span>⭐ {r.rating.toFixed(1)}</span>
                <span>🚚 от {r.min_order_tjs} TJS</span>
                {r.free_delivery ? <span className="text-[var(--brand)] font-semibold">Бесплатная доставка</span> : null}
              </div>
              <div className="mt-2 flex gap-2">
                {r.discount_text ? <span className="rounded-full bg-[var(--brand)] px-4 py-1 text-xs font-bold text-white">{r.discount_text}</span> : null}
                {r.cashback_text ? <span className="rounded-full bg-indigo-500 px-4 py-1 text-xs font-bold text-white">{r.cashback_text}</span> : null}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Delivery / Pickup tabs */}
      <div className="flex gap-3 px-3 py-4">
        <Pill active>Доставка</Pill>
        <Pill>Навынос</Pill>
      </div>

      {/* Search */}
      <div className="px-3">
        <div className="rounded-full bg-gray-100 px-4 py-3 text-sm text-gray-400">🔍</div>
      </div>

      {/* Food categories */}
      <div className="flex gap-3 px-3 py-3">
        <Pill active>Завтраки</Pill>
        <Pill>Бургеры</Pill>
        <Pill>Пиццы</Pill>
        <Pill>Суши</Pill>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 gap-4 p-3">
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-[22px] bg-white shadow-md">
            <Link href={`/product/${p.id}`}>
              <div className="relative h-28 bg-gray-200">
                <div className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/70">♡</div>
              </div>
            </Link>
            <div className="p-3">
              <div className="text-lg font-extrabold leading-tight">{p.name}</div>
              <div className="text-xs text-gray-500">{p.description}</div>
              <div className="mt-2 text-lg font-extrabold">{p.price_tjs} TJS</div>
              <AddToCartBtn product={{ id: p.id, name: p.name, price_tjs: p.price_tjs }} />
            </div>
          </div>
        ))}
      </div>

      {/* Floating cart bar */}
      <div className="fixed bottom-14 left-0 right-0 mx-auto max-w-[430px] bg-indigo-400 px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">1 – Блюда</div>
            <div className="text-xl font-extrabold">42 TJS</div>
          </div>
          <Link href="/cart" className="rounded-full bg-white px-6 py-3 font-bold text-indigo-600">Посмотреть корзину</Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
