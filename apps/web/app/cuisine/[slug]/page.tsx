import Link from "next/link";
import { BottomNav } from "../../../components/BottomNav";
import { apiGet } from "../../../lib/api";
import { Card } from "../../../components/ui";

type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  eta_min: number;
  eta_max: number;
  min_order_tjs: number;
  discount_text?: string | null;
  cashback_text?: string | null;
};

export default async function CuisinePage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const restaurants = await apiGet<Restaurant[]>("/restaurants");

  return (
    <div className="pb-20">
      <div className="flex items-center gap-3 p-3">
        <Link href="/cuisines" className="rounded-full bg-gray-100 px-4 py-2 font-semibold">←</Link>
        <div className="flex-1 text-center text-2xl font-extrabold">{slug}</div>
        <div className="w-10" />
      </div>

      <div className="space-y-4 p-3">
        {restaurants.filter(r => r.cuisine === slug).map((r) => (
          <Link key={r.id} href={`/restaurant/${r.id}`}>
            <Card>
              <div className="relative">
                <div className="h-44 rounded-[22px] bg-gray-200" />
                <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/70">♡</div>
                {r.discount_text ? (
                  <div className="absolute right-3 top-3 rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white">
                    {r.discount_text}
                  </div>
                ) : null}
                {r.cashback_text ? (
                  <div className="absolute right-3 top-14 rounded-full bg-indigo-500 px-4 py-2 text-xs font-bold text-white">
                    {r.cashback_text}
                  </div>
                ) : null}
              </div>
              <div className="px-4 pb-4 pt-3">
                <div className="text-xl font-extrabold">{r.name}</div>
                <div className="text-sm text-gray-500">{r.cuisine}</div>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                  <span>🕒 {r.eta_min}-{r.eta_max} мин.</span>
                  <span>⭐ {r.rating.toFixed(1)}</span>
                  <span>🚚 от {r.min_order_tjs} TJS</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        <div className="text-center text-sm text-gray-500">
          Если список пуст — добавим рестораны в админке (будет в следующем спринте).
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
