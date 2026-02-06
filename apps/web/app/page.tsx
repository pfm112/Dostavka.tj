import Link from "next/link";
import { BottomNav } from "../components/BottomNav";
import { Badge, Card, IconBtn, Pill } from "../components/ui";
import { apiGet } from "../lib/api";

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

export default async function Home() {
  const restaurants = await apiGet<Restaurant[]>("/restaurants");

  return (
    <div className="pb-20">
      {/* Header with address bar */}
      <div className="flex items-center gap-2 p-3">
        <div className="h-10 w-10 rounded-full bg-[var(--brand)]/20" />
        <div className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-center text-sm text-gray-500">
          Адрес доставки
        </div>
        <IconBtn>👤</IconBtn>
      </div>

      {/* Banner */}
      <div className="px-3">
        <div className="h-24 rounded-[22px] bg-pink-200 p-4">
          <div className="text-lg font-extrabold leading-tight">
            Скидка 20%<br/>в ресторанах
          </div>
          <div className="mt-1 text-sm font-semibold">промокод SALE20</div>
        </div>
      </div>

      {/* Big category buttons */}
      <div className="grid grid-cols-2 gap-3 p-3">
        <Link
          href="/restaurants"
          className="rounded-[26px] bg-[var(--brand)] p-6 text-center text-white active:scale-[0.99]"
        >
          <div className="text-3xl">☕</div>
          <div className="mt-2 text-lg font-bold">Рестораны</div>
        </Link>

        <div className="grid gap-3">
          <Link
            href="/pharmacies"
            className="rounded-[26px] bg-indigo-200 p-5 text-center active:scale-[0.99]"
          >
            <div className="text-2xl">➕</div>
            <div className="mt-1 font-bold">Аптеки</div>
          </Link>

          <Link
            href="/shops"
            className="rounded-[26px] bg-gray-200 p-5 text-center active:scale-[0.99]"
          >
            <div className="text-2xl">🏪</div>
            <div className="mt-1 font-bold">Магазины</div>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="px-3">
        <form
          action="/search"
          method="get"
          className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-3"
        >
          <span className="text-sm text-gray-500">🔍</span>
          <input
            name="q"
            placeholder="Поиск ресторана..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            autoComplete="off"
          />
        </form>
      </div>

      {/* Cuisine tabs */}
      <div className="flex gap-3 px-3 py-3">
        <Pill active>Завтраки</Pill>
        <Pill>Бургеры</Pill>
        <Pill>Пиццы</Pill>
        <Pill>Суши</Pill>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between px-3">
        <h1 className="text-3xl font-extrabold">Рестораны</h1>
        <Link
          className="rounded-full bg-[var(--brand)] px-6 py-2 text-sm font-bold text-white"
          href="/cuisines"
        >
          Все
        </Link>
      </div>

      {/* List */}
      <div className="space-y-4 p-3">
        {restaurants.map((r) => (
          <Link key={r.id} href={`/restaurant/${r.id}`}>
            <Card>
              <div className="relative">
                <div className="h-44 rounded-[22px] bg-gray-200" />
                <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/70">
                  ♡
                </div>
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
                  {r.free_delivery ? <Badge>Бесплатная доставка</Badge> : null}
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
