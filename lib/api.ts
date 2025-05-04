export async function fetchPlaidDashboardData() {
    const res = await fetch("/api/plaid/dashboard");
    if (!res.ok) throw new Error("Failed to fetch dashboard data");
    return res.json();
  }