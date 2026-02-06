'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Restaurant = {
  id: number;
  name: string;
  cuisine?: string | null;
  rating?: number | null;
  eta_min?: number | null;
  eta_max?: number | null;
  min_order_tjs?: number | null;
  discount_text?: string | null;
  cashback_text?: string | null;
  is_active?: boolean;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

export default function RestaurantsPage() {
  const [items, setItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${API_URL}/restaurants`, { cache: "no-store" });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = (await res.json()) as Restaurant[];
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setErr(e?.message || "fetch_failed");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const active = useMemo(
    () => items.filter((r) => r.is_active !== false),
    [items]
  );

  return (
    <div className="mx-auto max-w-[430px] min-h-screen bg-white shadow">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Рестораны</h1>

        {!API_URL && (
          <div className="mt-3 rounded-xl border p-3 text-sm">
            ⚠️ Не задан NEXT_PUBLIC_API_URL. Добавь переменную в Vercel:
            <div className="mt-2 font-mono text-xs break-all">
              NEXT_PUBLIC_API_URL = https://dostavka-db.onrender.com
            </div>
          </div>
        )}

        {loading && <p className="mt-4">Загрузка…</p>}
        {err && (
          <p className="mt-4 text-red-600">
            Ошибка: {err}. Проверь API_URL и CORS.
          </p>
        )}

        <div className="mt-4 space-y-3">
          {active.map((r) => (
            <Link
              key={r.id}
              href={`/restaurant/${r.id}`}
              className="block rounded-2xl border p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{r.name}</div>
                  <div className="text-sm text-gray-600">
                    {r.cuisine || "Кухня"} ·{" "}
                    {r.eta_min && r.eta_max ? `${r.eta_min}-${r.eta_max} мин` : "—"}
                    {r.min_order_tjs ? ` · от ${r.min_order_tjs} TJS` : ""}
                  </div>
                </div>

                <div className="text-right text-sm">
                  {typeof r.rating === "number" && (
                    <div>⭐ {r.rating.toFixed(1)}</div>
                  )}
                </div>
              </div>

              <div className="mt-2 flex gap-2">
                {r.discount_text && (
                  <span className="rounded-full bg-green-600 px-3 py-1 text-xs text-white">
                    {r.discount_text}
                  </span>
                )}
                {r.cashback_text && (
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs text-white">
                    {r.cashback_text}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
