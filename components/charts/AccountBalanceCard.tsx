import { Card, CardContent } from "@/components/ui/Card"

interface Account {
  name: string
  balance: number
  type: string
}

export function AccountBalanceCard({ account }: { account: Account }) {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-4 space-y-2">
        <p className="text-sm text-gray-500">{account.name}</p>
        <p
          className={`text-xl font-bold ${
            account.balance < 0 ? 'text-red-500' : 'text-green-600'
          }`}
        >
          ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-400 capitalize">{account.type}</p>
      </CardContent>
    </Card>
  )
}
