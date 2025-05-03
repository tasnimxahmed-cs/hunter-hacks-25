import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Elaichi Finance</h2>
        <nav className="space-y-4">
          <a href="/dashboard" className="block hover:text-purple-600">Overview</a>
          <a href="/dashboard/transactions" className="block hover:text-purple-600">Transactions</a>
          <a href="/dashboard/budgets" className="block hover:text-purple-600">Budgets</a>
          <a href="/dashboard/settings" className="block hover:text-purple-600">Settings</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Topbar */}
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <SignOutButton />
        </header>

        <section>{children}</section>
      </main>
    </div>
  );
}
