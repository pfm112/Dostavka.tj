"use client";

import Link from "next/link";
import { BottomNav } from "../../components/BottomNav";
import { apiGet } from "../../lib/api";
import { useAppStore } from "../../lib/store";
import { useEffect, useState } from "react";

type Order = { id: number; public_number: string; status: string; total_tjs: number; created_at: string; };

export default function OrdersPage() {
  const phone = useAppStore((s) => s.phone);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!phone) return;
    apiGet<Order[]>(`/orders?phone=${encodeURIComponent(phone)}`).then(setOrders).catch(() => setOrders([]));
  }, [phone]);

  return (
    <div className="pb-20">
      <div className="p-3 text-center text-3xl font-extrabold">Заказы</div>

      <div className="flex gap-3 px-3">
        <div className="flex-1 rounded-full bg-[var(--brand)] py-3 text-center font-extrabold text-white">Текущие</div>
        <div className="flex-1 rounded-full bg-gray-100 py-3 text-center font-extrabold text-gray-500">История</div>
      </div>

      <div className="space-y-4 p-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-[22px] bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="font-extrabold">№ {o.public_number}</div>
              <div className="text-sm text-gray-500">{new Date(o.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-gray-600">Итого:</div>
              <div className="font-extrabold text-[var(--brand)]">{o.total_tjs} TJS</div>
            </div>
            <div className="mt-3 flex gap-3">
              <Link href={`/orders/${o.id}`} className="flex-1 rounded-full bg-gray-100 py-3 text-center font-extrabold">Посмотреть</Link>
              <button className="flex-1 rounded-full bg-gray-100 py-3 text-center font-extrabold text-gray-400">Отменить</button>
            </div>
            <div className="mt-2 text-sm text-indigo-600 font-semibold">{statusText(o.status)}</div>
          </div>
        ))}
        {!phone ? <div className="text-center text-sm text-gray-500">Введите телефон в корзине, чтобы видеть свои заказы.</div> : null}
      </div>

      <BottomNav />
    </div>
  );
}

function statusText(s: string) {
  if (s === "accepted") return "Заказ принят";
  if (s === "cooking") return "Готовиться";
  if (s === "on_the_way") return "В пути";
  if (s === "delivered") return "Доставлено";
  if (s === "cancelled") return "Отменён";
  return s;
}
