import Link from "next/link";
import { apiGet } from "../../../lib/api";
import { IconBtn, Pill } from "../../../components/ui";
import { AddQtyBar } from "./parts";

type Product = { id: number; name: string; description: string; price_tjs: number; };

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const p = await apiGet<Product>(`/products/${id}`);

  return (
    <div className="pb-6">
      <div className="p-3">
        <Link href=".." className="inline-block rounded-full bg-gray-100 px-4 py-2 font-semibold">←</Link>
      </div>

      <div className="px-3">
        <div className="relative h-56 overflow-hidden rounded-[26px] bg-gray-200">
          <div className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-black/30 text-white">♥</div>
        </div>

        <div className="mt-4 text-3xl font-extrabold">{p.name}</div>
        <div className="mt-2 text-sm text-gray-500">{p.description || "Описание блюда (из дизайна)"}</div>

        <div className="mt-4 text-3xl font-extrabold">{p.price_tjs} TJS</div>

        {/* Sizes */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Pill>Маленькая<br/><span className="text-xs font-semibold opacity-70">25–30 см</span></Pill>
          <Pill active>Средняя<br/><span className="text-xs font-semibold opacity-90">35–40 см</span></Pill>
          <Pill>Большая<br/><span className="text-xs font-semibold opacity-70">40–45 см</span></Pill>
        </div>

        {/* Ingredients */}
        <div className="mt-6">
          <div className="text-xl font-extrabold">Дополнительный<br/>ингредиенты</div>
          <div className="mt-3 space-y-3 text-lg">
            {["Сыр", "Лук", "Соус терияки", "Кетчуп", "Колбаски"].map((x, i) => (
              <div key={x} className="flex items-center gap-3">
                <div className={"h-5 w-5 rounded-full " + (i % 2 === 0 ? "bg-[var(--brand)]" : "bg-gray-200")} />
                <div>{x}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddQtyBar product={{ id: p.id, name: p.name, price_tjs: p.price_tjs }} />
    </div>
  );
}
