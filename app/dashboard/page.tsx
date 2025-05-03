import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Welcome back, {session?.user?.name?.split(" ")[0]}!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Total Balance</p>
          <p className="text-2xl font-bold">$12,345.67</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">This Month's Spending</p>
          <p className="text-2xl font-bold">$1,234.56</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Budget Remaining</p>
          <p className="text-2xl font-bold">$765.44</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Coffee at Blue Bottle</span>
            <span>-$4.50</span>
          </li>
          <li className="flex justify-between">
            <span>Groceries</span>
            <span>-$62.00</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
