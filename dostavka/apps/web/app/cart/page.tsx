"use client";

import Link from "next/link";
import { BottomNav } from "../../components/BottomNav";
import { useAppStore } from "../../lib/store";
import { apiPost } from "../../lib/api";
import { useState } from "react";

export default function CartPage() {
  const cart = useAppStore((s) => s.cart);
  const inc = useAppStore((s) => s.inc);
  const dec = useAppStore((s) => s.dec);
  const phone = useAppStore((s) => s.phone);
  const setPhone = useAppStore((s) => s.setPhone);
  const clear = useAppStore((s) => s.clear);

  const subtotal = cart.reduce((a, x) => a + x.price_tjs * x.qty, 0);
  const delivery = cart.length ? 15 : 0;
  const total = subtotal + delivery;

  const [creating, setCreating] = useState(false);
  const [createdId, setCreatedId] = useState<number | null>(null);

  async function createOrder() {
    setCreating(true);
    try {
      const order = await apiPost<any>("/orders", {
        phone: phone || "+992",
        restaurant_id: 1,
        items: cart.map((x) => ({ product_id: x.product_id, qty: x.qty })),
      });
      setCreatedId(order.id);
      clear();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="pb-20">
      <div className="p-3">
        <Link href="/" className="inline-block rounded-full bg-gray-100 px-4 py-2 font-semibold">←</Link>
        <div className="mt-2 text-center text-3xl font-extrabold">Корзина</div>
      </div>

      <div className="space-y-4 px-3">
        {cart.map((it) => (
          <div key={it.product_id} className="flex items-center gap-3 rounded-[22px] bg-white p-3 shadow-md">
            <div className="h-14 w-20 rounded-[18px] bg-gray-200" />
            <div className="flex-1">
              <div className="font-extrabold">{it.name}</div>
              <div className="text-gray-600">{it.price_tjs} TJS</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => dec(it.product_id)} className="h-10 w-10 rounded-full bg-indigo-300 text-xl font-extrabold text-white">-</button>
              <div className="w-6 text-center font-extrabold">{it.qty}</div>
              <button onClick={() => inc(it.product_id)} className="h-10 w-10 rounded-full bg-indigo-300 text-xl font-extrabold text-white">+</button>
            </div>
          </div>
        ))}

        {/* Address */}
        <div className="rounded-[22px] bg-white p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xl font-extrabold">Добавить адрес</div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-xl">＋</div>
          </div>
          <div className="mt-3 rounded-full bg-gray-100 px-4 py-3 text-sm text-gray-600">Домой • кучаи Лермонтова 25, кв72...</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-full bg-gray-100 px-4 py-3 text-sm text-gray-500">Подъезд</div>
            <div className="rounded-full bg-gray-100 px-4 py-3 text-sm text-gray-500">Код двери</div>
            <div className="rounded-full bg-gray-100 px-4 py-3 text-sm text-gray-500">кв / офис</div>
            <div className="rounded-full bg-gray-100 px-4 py-3 text-sm text-gray-500">Этаж</div>
          </div>
          <div className="mt-3 rounded-[22px] bg-gray-100 px-4 py-4 text-sm text-gray-500">Добавить комментарий курьеру</div>
        </div>

        {/* Payment */}
        <div className="rounded-[22px] bg-white p-4 shadow-md">
          <div className="text-xl font-extrabold">Способ оплаты</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-[18px] bg-gray-100 px-3 py-4 text-center text-xs text-gray-400">По карте</div>
            <div className="rounded-[18px] bg-gray-100 px-3 py-4 text-center text-xs text-gray-400">QR code</div>
            <div className="rounded-[18px] border-2 border-[var(--brand)] bg-white px-3 py-4 text-center text-xs font-bold text-[var(--brand)]">Наличными</div>
          </div>
        </div>

        {/* Promo */}
        <div className="rounded-[22px] bg-white p-4 shadow-md">
          <div className="text-xl font-extrabold">Промокод</div>
          <div className="mt-3 flex gap-3">
            <div className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-sm text-gray-500">Промокод</div>
            <div className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-extrabold text-white">Подтвердить</div>
          </div>
        </div>

        {/* Totals */}
        <div className="rounded-[22px] bg-white p-4 shadow-md">
          <div className="text-xl font-extrabold">Сумма заказа</div>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Сумма:" value={`${subtotal} TJS`} />
            <Row label="Доставка:" value={`${delivery} TJS`} />
            <Row label="Скидка по промокоду:" value={`0 TJS`} />
            <Row label="Итого:" value={`${total} TJS`} strong />
          </div>
        </div>

        {/* Phone (for demo order create) */}
        <div className="rounded-[22px] bg-white p-4 shadow-md">
          <div className="text-xl font-extrabold">Номер телефона</div>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+992..." className="mt-3 w-full rounded-full bg-gray-100 px-4 py-3 outline-none" />
        </div>

        <button
          disabled={!cart.length || creating}
          onClick={createOrder}
          className="mb-4 w-full rounded-full bg-[var(--brand)] py-4 text-center text-xl font-extrabold text-white disabled:opacity-50"
        >
          Оформит заказ
        </button>

        {createdId ? (
          <Link className="block w-full rounded-full bg-white py-4 text-center text-xl font-extrabold text-[var(--brand)] shadow-md" href={`/orders/${createdId}`}>
            Перейти к заказу
          </Link>
        ) : null}
      </div>

      <BottomNav />
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
