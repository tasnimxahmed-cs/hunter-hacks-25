'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface Account {
  account_id: string
  name: string
}

interface Transaction {
  transaction_id: string
  account_id: string
  name: string
  amount: number
  date: string
  category?: string[]
}

export default function TransactionsClient({ userId }: { userId: string }) {
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [selectedAccountId, setSelectedAccountId] = React.useState<string>('')
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const router = useRouter()

  // Redirect if Plaid not linked
  React.useEffect(() => {
    fetch(`/api/has-plaid?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.linked) router.push('/dashboard')
      })
  }, [userId, router])

  // Fetch accounts
  React.useEffect(() => {
    fetch(`/api/plaid/accounts?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setAccounts(data.accounts)
        if (data.accounts.length > 0) {
          setSelectedAccountId(data.accounts[0].account_id)
        }
      })
  }, [userId])

  // Fetch & filter transactions when account changes
  React.useEffect(() => {
    if (!selectedAccountId) return
    setLoading(true)
    setTransactions([])    // clear previous

    fetch(`/api/plaid/transactions?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        // Filter by selectedAccountId
        const filtered = (data.transactions as Transaction[]).filter(
          (tx) => tx.account_id === selectedAccountId
        )
        setTransactions(filtered)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId, selectedAccountId])

  if (!accounts.length) return <p>Loading accounts...</p>

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      <Tabs value={selectedAccountId} onValueChange={setSelectedAccountId}>
        <TabsList className="flex space-x-2">
          {accounts.map(acc => (
            <TabsTrigger
              key={acc.account_id}
              value={acc.account_id}
              className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600"
            >
              {acc.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map(acc => (
          <TabsContent key={acc.account_id} value={acc.account_id} className="p-4">
            {loading ? (
              <p>Loading transactions...</p>
            ) : !transactions.length ? (
              <p className="text-sm text-gray-500">No transactions found for this account.</p>
            ) : (
              <div className="space-y-2">
                {transactions.map(tx => (
                  <Card key={tx.transaction_id} className="border shadow-sm">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{tx.name}</p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                        {tx.category && (
                          <p className="text-xs text-gray-400">
                            {tx.category.join(' > ')}
                          </p>
                        )}
                      </div>
                      <p
                        className={cn(
                          'font-semibold',
                          tx.amount < 0 ? 'text-green-600' : 'text-red-500'
                        )}
                      >
                        ${Math.abs(tx.amount).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
