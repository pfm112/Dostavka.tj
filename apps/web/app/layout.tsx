import "./globals.css";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-white">
        <div className="mx-auto max-w-[430px] min-h-screen pb-20">
          {children}
        </div>

        {/* Нижний футер */}
        <BottomNav />
      </body>
    </html>
  );
}
