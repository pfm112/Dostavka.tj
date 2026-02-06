'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white px-4 pb-28 pt-4">
      {/* Address */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1 rounded-full bg-gray-100 py-2 text-center text-sm text-gray-500">
          Адрес доставки
        </div>
        <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
          👤
        </div>
      </div>

      {/* Promo */}
      <div className="mb-5 rounded-3xl bg-pink-200 p-4">
        <div className="text-lg font-extrabold">Скидка 20%</div>
        <div className="text-sm font-medium">
          в ресторанах<br />промокод <b>SALE20</b>
        </div>
      </div>

      {/* TOP CATEGORIES */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/restaurants"
          className="flex h-[220px] flex-col items-center justify-center rounded-3xl bg-green-600 text-white shadow-sm active:scale-[0.99]"
        >
          <div className="mb-3 text-3xl">☕</div>
          <div className="text-lg font-extrabold">Рестораны</div>
        </Link>

        <div className="grid grid-rows-2 gap-4">
          <button className="flex h-full flex-col items-center justify-center rounded-3xl bg-indigo-200 font-extrabold shadow-sm active:scale-[0.99]">
            <div className="mb-2 text-3xl">＋</div>
            Аптеки
          </button>

          <button className="flex h-full flex-col items-center justify-center rounded-3xl bg-gray-200 font-extrabold shadow-sm active:scale-[0.99]">
            <div className="mb-2 text-3xl">🏪</div>
            Магазины
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-5 flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-400">
        🔍 Поиск ресторана...
      </div>

      {/* Filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {['Завтраки', 'Бургеры', 'Пиццы', 'Суши'].map((t, i) => (
          <button
            key={t}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              i === 0 ? 'bg-green-600 text-white' : 'bg-gray-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Рестораны</h2>
        <Link
          href="/restaurants"
          className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white"
        >
          Все
        </Link>
      </div>

      {/* Restaurant cards */}
      <div className="mt-4 space-y-4">
        <RestaurantCard name="J Burger" cuisine="Европейская кухня" rating="4.3" />
        <RestaurantCard name="Истиклол Пицца" cuisine="Итальянская кухня" rating="4.3" />
      </div>
    </div>
  );
}

function RestaurantCard({
  name,
  cuisine,
  rating,
}: {
  name: string;
  cuisine: string;
  rating: string;
}) {
  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      {/* IMAGE AREA (фикс высота, одинаковые отступы, элементы absolute) */}
      <div className="relative h-[140px] rounded-3xl bg-gray-200">
        {/* heart */}
        <button
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-lg"
          aria-label="favorite"
        >
          ♡
        </button>

        {/* badges */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
            -25% на всё
          </span>
          <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold text-white">
            10% кешбек
          </span>
        </div>
      </div>

      {/* CONTENT (фиксированные paddings) */}
      <div className="px-4 pb-4 pt-3">
        <div className="text-lg font-extrabold">{name}</div>
        <div className="mt-1 text-sm text-gray-600">{cuisine}</div>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <span>🕒</span>
            <span>20-25 мин.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{rating}</span>
          </div>

          <div className="flex items-center gap-1">
            <span>🚚</span>
            <span>от 50 TJS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
