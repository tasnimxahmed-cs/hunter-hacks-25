'use client'

import { useEffect, useState } from 'react'
import PlaidLinkButton from './PlaidLinkButton'
import { Card, CardContent } from '@/components/ui/Card'
import { SpendingPieChart } from './charts/SpendingPieChart'
import { WeeklySpendingLineChart } from './charts/WeeklySpendingLineChart'
import { AccountBalanceCard } from './charts/AccountBalanceCard'

interface DashboardClientProps {
  userId: string
  userName?: string | null
}

export default function DashboardClient({ userId, userName }: DashboardClientProps) {
  const [plaidLinked, setPlaidLinked] = useState(false)
  const [spendingByCategory, setSpendingByCategory] = useState<{ name: string; value: number }[]>([])
  const [weeklySpending, setWeeklySpending] = useState<{ day: string; amount: number }[]>([])
  const [accounts, setAccounts] = useState<{ name: string; balance: number; type: string }[]>([])

  useEffect(() => {
    const fetchPlaidData = async () => {
      // Check if plaid is linked
      const linkRes = await fetch(`/api/has-plaid?userId=${userId}`)
      const linkData = await linkRes.json()
      setPlaidLinked(linkData.linked)

      if (!linkData.linked) return

      try {
        const [accountsRes, transactionsRes] = await Promise.all([
          fetch(`/api/plaid/accounts?userId=${userId}`),
          fetch(`/api/plaid/transactions?userId=${userId}`),
        ])

        const accountsData = await accountsRes.json()
        console.log('📝 RAW ACCOUNTS DATA:', accountsData)
        const transactionsData = await transactionsRes.json()
        console.log('📝 RAW TRANSACTIONS DATA:', transactionsData)

        // 1. Set account balances
        setAccounts(
          accountsData.accounts.map((acc: any) => ({
            name: acc.name,
            balance: acc.balances.current || 0,
            type: acc.type,
          }))
        )

        // 2. Process spending by category
        const categoryTotals: { [key: string]: number } = {}
        transactionsData.transactions.forEach((txn: any) => {
          const category = txn.category?.[0] || 'Other'
          if (!categoryTotals[category]) categoryTotals[category] = 0
          categoryTotals[category] += txn.amount
        })

        setSpendingByCategory(
          Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value,
          }))
        )

        // 3. Weekly spending (Mon–Sun)
        const weekly: { [key: string]: number } = {
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
          Sun: 0,
        }

        const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        transactionsData.transactions.forEach((txn: any) => {
          const date = new Date(txn.date)
          const day = dayMap[date.getDay()]
          weekly[day] += txn.amount
        })

        setWeeklySpending(
          ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
            day,
            amount: parseFloat(weekly[day].toFixed(2)),
          }))
        )
      } catch (error) {
        console.error('Error fetching Plaid data:', error)
      }
    }

    fetchPlaidData()
  }, [userId])

  if (!plaidLinked) {
    return (
      <div>
        <PlaidLinkButton onLinkSuccess={() => setPlaidLinked(true)} />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">
        Welcome back, {userName?.split(' ')[0]}!
      </h2>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Total Balance</p>
          <p className="text-2xl font-bold">
            $
            {accounts.reduce((acc, a) => acc + a.balance, 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">This Week's Spending</p>
          <p className="text-2xl font-bold">
            $
            {weeklySpending.reduce((acc, d) => acc + d.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Top Category</p>
          <p className="text-2xl font-bold">
            {
              spendingByCategory.length > 0
              ? spendingByCategory.reduce((prev, current) =>
                  prev.value > current.value ? prev : current
                ).name
              : 'N/A'            
            }
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
            <SpendingPieChart
              data={spendingByCategory}
              total={spendingByCategory.reduce((sum, item) => sum + item.value, 0)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Spending</h3>
            <WeeklySpendingLineChart data={weeklySpending} />
          </CardContent>
        </Card>
      </div>

      {/* Account Balances */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Accounts Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map((account, idx) => (
              <AccountBalanceCard key={idx} account={account} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
