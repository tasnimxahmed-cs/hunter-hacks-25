import { auth } from "@/auth"
import DashboardClient from "@/components/DashboardClient"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <p>Unauthorized</p>
  }

  return (
    <DashboardClient userId={session.user.id} userName={session.user.name} />
  )
}
