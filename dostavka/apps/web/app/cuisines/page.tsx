import Link from "next/link";
import { BottomNav } from "../../components/BottomNav";
import { Card, IconBtn } from "../../components/ui";

const cuisines = [
  "Национальная кухня",
  "Европейская кухня",
  "Турецкая кухня",
  "Японская кухня",
  "Fast food",
  "Полезная кухня",
  "Домашняя кухня",
];

export default function Cuisines() {
  return (
    <div className="pb-20">
      <div className="flex items-center gap-3 p-3">
        <Link href="/" className="rounded-full bg-gray-100 px-4 py-2 font-semibold">←</Link>
        <div className="flex-1 text-center text-2xl font-extrabold">Все рестораны</div>
        <div className="w-10" />
      </div>

      <div className="grid grid-cols-2 gap-4 p-3">
        {cuisines.map((c) => (
          <Link key={c} href={`/cuisine/${encodeURIComponent(c)}`}>
            <div className="overflow-hidden rounded-[22px] bg-white shadow-md">
              <div className="h-24 bg-gray-200" />
              <div className="p-3 text-center font-bold">{c}</div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
