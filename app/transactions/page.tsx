import { auth } from "@/auth"
import TransactionsClient from '@/components/TransactionsClient'

export default async function TransactionsPage() {
  const session = await auth()

  if (!session?.user) {
    return <p>Unauthorized</p>
  }

  return <TransactionsClient userId={session.user.id} />
}
