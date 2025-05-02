import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <nav className="bg-blue-500 p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
            <div className="text-2xl font-semibold">Finance Tracker</div>
            <div></div> {}
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white py-6 mt-8">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm">Hunter Hacks 2025 | Tasnim & Kabir</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
