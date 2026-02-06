import Link from "next/link";

type CuisineCard = {
  title: string;
  slug: string;
  img: string;
};

const CUISINES: CuisineCard[] = [
  { title: "Национальная кухня", slug: "national", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=60" },
  { title: "Европейская кухня", slug: "european", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=60" },
  { title: "Турецкая кухня", slug: "turkish", img: "https://images.unsplash.com/photo-1604909053196-9833f2cc0c0d?auto=format&fit=crop&w=1200&q=60" },
  { title: "Японская кухня", slug: "japanese", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=60" },
  { title: "Fast food", slug: "fast-food", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=60" },
  { title: "Полезная кухня", slug: "healthy", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=60" },
  { title: "Домашняя кухня", slug: "home", img: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=1200&q=60" },
];

export default function RestaurantsRoot() {
  return (
    <div className="mx-auto max-w-[430px] min-h-screen bg-white p-4">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          ←
        </Link>
        <h1 className="text-xl font-extrabold flex-1 text-center pr-10">Все кухни</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CUISINES.map((c) => (
          <Link
            key={c.slug}
            href={`/cuisine/${c.slug}`}
            className="block rounded-2xl overflow-hidden shadow-sm border bg-white"
          >
            <div
              className="h-28 w-full bg-center bg-cover"
              style={{ backgroundImage: `url(${c.img})` }}
            />
            <div className="p-3">
              <div className="font-semibold text-sm leading-tight">{c.title}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/restaurants/all"
          className="block w-full text-center rounded-2xl py-3 font-semibold bg-green-600 text-white"
        >
          Все рестораны
        </Link>
      </div>
    </div>
  );
}
