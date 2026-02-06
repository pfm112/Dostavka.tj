import Link from "next/link";
import { BottomNav } from "../../components/BottomNav";
import { Card, Badge } from "../../components/ui";
import { apiGet } from "../../lib/api";

type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  eta_min: number;
  eta_max: number;
  min_order_tjs: number;
  free_delivery: boolean;
  discount_text?: string | null;
  cashback_text?: string | null;
};

export default async function RestaurantsPage() {
  const restaurants = await apiGet<Restaurant[]>("/restaurants");

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between p-3">
        <Link href="/" className="text-sm font-bold">← Назад</Link>
        <div className="text-lg font-extrabold">Рестораны</div>
        <div className="w-14" />
      </div>

      <div className="space-y-4 p-3">
        {restaurants.map((r) => (
          <Link key={r.id} href={`/restaurant/${r.id}`}>
            <Card>
              <div className="h-44 rounded-[22px] bg-gray-200" />
              <div className="px-4 pb-4 pt-3">
                <div className="text-xl font-extrabold">{r.name}</div>
                <div className="text-sm text-gray-500">{r.cuisine}</div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span>🕒 {r.eta_min}-{r.eta_max} мин.</span>
                  <span>⭐ {r.rating.toFixed(1)}</span>
                  <span>🚚 от {r.min_order_tjs} TJS</span>
                  {r.free_delivery ? <Badge>Бесплатная доставка</Badge> : null}
                </div>

                <div className="mt-2 flex gap-2">
                  {r.discount_text ? (
                    <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-bold text-white">
                      {r.discount_text}
                    </span>
                  ) : null}
                  {r.cashback_text ? (
                    <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold text-white">
                      {r.cashback_text}
                    </span>
                  ) : null}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
