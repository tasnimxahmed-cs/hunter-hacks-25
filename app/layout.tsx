import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>Waddle | Finance Tracker</title>
      </head>
      <body className="">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}