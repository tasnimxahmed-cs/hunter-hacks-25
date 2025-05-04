import { useEffect, useState } from 'react'

export interface Transaction {
  name: string
  amount: number
  category: string[]
  date: string
}

export function usePlaidTransactions(userId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch(`/api/plaid/transactions?userId=${userId}`)
      const data = await res.json()
      setTransactions(data.transactions || [])
      setLoading(false)
    }

    fetchTransactions()
  }, [userId])

  return { transactions, loading }
}
