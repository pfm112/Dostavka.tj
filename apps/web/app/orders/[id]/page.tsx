"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "../../../lib/api";
import { BottomNav } from "../../../components/BottomNav";

type Order = { id: number; public_number: string; status: string; subtotal_tjs: number; delivery_tjs: number; discount_tjs: number; total_tjs: number; created_at: string; };

export default function OrderPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [o, setO] = useState<Order | null>(null);

  useEffect(() => {
    apiGet<Order>(`/orders/${id}`).then(setO).catch(() => setO(null));
  }, [id]);

  return (
    <div className="pb-20">
      <div className="p-3">
        <Link href="/orders" className="inline-block rounded-full bg-gray-100 px-4 py-2 font-semibold">←</Link>
      </div>

      <div className="px-3">
        <div className="rounded-[22px] bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--brand)] text-white text-2xl">✓</div>
            <div>
              <div className="text-xl font-extrabold">{statusTitle(o?.status)}</div>
              <div className="text-sm text-gray-500">Мы перезвоним в течении 3 минут, для подтверждения заказ</div>
              <div className="text-sm text-gray-400">Спасибо вам, что выбрали нас</div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[22px] bg-white p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xl font-extrabold">Номер заказа: № {o?.public_number ?? "—"}</div>
            <div className="text-sm text-gray-500">{o ? new Date(o.created_at).toLocaleString() : ""}</div>
          </div>

          <div className="mt-4 flex items-center justify-between text-center text-xs text-gray-400">
            <Step active label="Заказ принять" />
            <div>→</div>
            <Step active={o?.status !== "accepted"} label="Готовиться" />
            <div>→</div>
            <Step active={o?.status === "on_the_way" || o?.status === "delivered"} label="В пути" />
            <div>→</div>
            <Step active={o?.status === "delivered"} label="Доставлено" />
          </div>

          <div className="mt-6 text-xl font-extrabold">Сумма заказа</div>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Сумма:" value={`${o?.subtotal_tjs ?? 0} TJS`} />
            <Row label="Доставка:" value={`${o?.delivery_tjs ?? 0} TJS`} />
            <Row label="Скидка по промокоду:" value={`${o?.discount_tjs ?? 0} TJS`} />
            <Row label="Итого:" value={`${o?.total_tjs ?? 0} TJS`} strong />
          </div>
        </div>

        <button disabled className="mt-4 w-full rounded-full bg-gray-200 py-4 text-xl font-extrabold text-gray-400">
          Отменить заказ
        </button>
        <Link href="/" className="mt-3 block w-full rounded-full bg-[var(--brand)] py-4 text-center text-xl font-extrabold text-white">
          Вернуться на главную
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}

function Step({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="w-16">
      <div className={"mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full " + (active ? "bg-[var(--brand)] text-white" : "bg-gray-100")}>
        {active ? "▦" : "○"}
      </div>
      <div className={active ? "text-[var(--brand)] font-semibold" : ""}>{label}</div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <div className="text-gray-600">{label}</div>
      <div className={strong ? "font-extrabold text-[var(--brand)]" : "font-semibold"}>{value}</div>
    </div>
  );
}

function statusTitle(s?: string) {
  if (s === "accepted") return "Заказ принят";
  if (s === "cooking") return "Готовиться";
  if (s === "on_the_way") return "В пути";
  if (s === "delivered") return "Доставлено";
  if (s === "cancelled") return "Отменён";
  return "Заказ принят";
}
