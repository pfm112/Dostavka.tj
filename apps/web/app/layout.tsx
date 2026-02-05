import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "dostavka.tj",
  description: "Food delivery MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow">
          {children}
        </div>
      </body>
    </html>
  );
}
