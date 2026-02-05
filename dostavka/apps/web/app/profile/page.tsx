"use client";

import { BottomNav } from "../../components/BottomNav";
import { useAppStore } from "../../lib/store";

export default function ProfilePage() {
  const phone = useAppStore((s) => s.phone);

  return (
    <div className="pb-20">
      <div className="p-3">
        <div className="text-center text-3xl font-extrabold">Профиль</div>
      </div>

      <div className="px-3">
        <div className="rounded-[22px] bg-white p-4 shadow-md">
          <div className="text-xl font-extrabold">Фируз Фирузыч</div>
          <div className="mt-1 text-sm text-gray-500">{phone || "Телефон не указан"}</div>
          <div className="mt-3 text-lg font-extrabold text-[var(--brand)]">Бонус: 1250 TJS</div>
        </div>

        <div className="mt-4 rounded-[22px] bg-white p-2 shadow-md">
          {["Заказы", "Уведомления", "Способ оплаты", "Настройка аккаунта", "Помощь", "Безопасность"].map((x) => (
            <div key={x} className="flex items-center justify-between rounded-[18px] px-4 py-4 hover:bg-gray-50">
              <div className="font-semibold">{x}</div>
              <div className="text-gray-400">›</div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
