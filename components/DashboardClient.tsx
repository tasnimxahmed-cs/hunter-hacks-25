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

interface Account {
  name: string
  balance: number
  type: string
}

interface Transaction {
  transaction_id: string
  date: string  // in "YYYY-MM-DD" format
  amount: number
  category?: string[]
}

// Compute net balance by subtracting liabilities
const computeNetBalance = (accounts: Account[]) =>
  accounts.reduce((total, account) => {
    const type = account.type.toLowerCase()
    const isLiability = ['credit', 'loan', 'other'].includes(type)
    return isLiability ? total - account.balance : total + account.balance
  }, 0)

export default function DashboardClient({ userId, userName }: DashboardClientProps) {
  const [plaidLinked, setPlaidLinked] = useState(false)
  const [spendingByCategory, setSpendingByCategory] = useState<{ name: string; value: number }[]>([])
  const [weeklySpending, setWeeklySpending] = useState<{ day: string; amount: number }[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    const fetchPlaidData = async () => {
      const linkRes = await fetch(`/api/has-plaid?userId=${userId}`)
      const { linked } = await linkRes.json()
      setPlaidLinked(linked)
      if (!linked) return

      try {
        const [acctRes, txRes] = await Promise.all([
          fetch(`/api/plaid/accounts?userId=${userId}`),
          fetch(`/api/plaid/transactions?userId=${userId}`),
        ])
        const { accounts } = await acctRes.json()
        const { transactions } = await txRes.json()

        // Set accounts
        setAccounts(
          accounts.map((a: any) => ({
            name: a.name,
            balance: a.balances.current || 0,
            type: a.type,
          }))
        )

        // Filter to last 7 days' positive transactions
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const recentTxs: Transaction[] = transactions.filter((tx: any) => {
          const txDate = new Date(tx.date)
          return tx.amount > 0 && txDate >= sevenDaysAgo
        })

        // Spending by category (last 7 days)
        const catTotals: Record<string, number> = {}
        recentTxs.forEach(tx => {
          const cat = tx.category?.[0] || 'Other'
          catTotals[cat] = (catTotals[cat] || 0) + tx.amount
        })
        setSpendingByCategory(
          Object.entries(catTotals).map(([name, value]) => ({
            name,
            value: parseFloat(value.toFixed(2)),
          }))
        )

        // Spending by date (last 7 days)
        const dailyMap: Record<string, number> = {}
        recentTxs.forEach(tx => {
          // Timezone-safe parse of YYYY-MM-DD
          const [year, month, day] = tx.date.split('-')
          const dateStr = `${month}/${day}`  // e.g. "05/01"
          dailyMap[dateStr] = (dailyMap[dateStr] || 0) + tx.amount
        })

        // Sort the dates ascending for the chart
        const sortedDates = Object.keys(dailyMap).sort((a, b) => {
          const [am, ad] = a.split('/').map(Number)
          const [bm, bd] = b.split('/').map(Number)
          // Compare by month then day
          return am === bm ? ad - bd : am - bm
        })

        setWeeklySpending(
          sortedDates.map(date => ({
            day: date,
            amount: parseFloat(dailyMap[date].toFixed(2)),
          }))
        )
      } catch (e) {
        console.error('Error fetching Plaid data:', e)
      }
    }

    fetchPlaidData()
  }, [userId])

  if (!plaidLinked) {
    return <PlaidLinkButton onLinkSuccess={() => setPlaidLinked(true)} />
  }

  const netBalance = computeNetBalance(accounts)
  const weekTotal = weeklySpending.reduce((sum, w) => sum + w.amount, 0)

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">
        Welcome back, {userName?.split(' ')[0]}!
      </h2>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Net Balance</p>
          <p className={`text-2xl font-bold ${netBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Last 7 Days' Spending</p>
          <p className="text-2xl font-bold">${weekTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Top Category (Last 7 Days)</p>
          <p className="text-2xl font-bold">
            {spendingByCategory.length
              ? spendingByCategory.reduce((a, b) => (a.value > b.value ? a : b)).name
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Spending by Category (Last 7 Days)</h3>
            <SpendingPieChart
              data={spendingByCategory}
              total={spendingByCategory.reduce((sum, i) => sum + i.value, 0)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Spending by Date (Last 7 Days)</h3>
            <WeeklySpendingLineChart data={weeklySpending} />
          </CardContent>
        </Card>
      </div>

      {/* Account Balances */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Accounts Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map((acct, idx) => (
              <AccountBalanceCard key={idx} account={acct} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
