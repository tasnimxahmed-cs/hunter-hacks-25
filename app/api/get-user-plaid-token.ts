import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/crypto'

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Because userId is unique, we can use findUnique
  const plaidItem = await prisma.plaidItem.findUnique({
    where: {
      userId: session.user.id,
    },
  })

  if (!plaidItem) {
    return new NextResponse("No linked Plaid account found", { status: 404 })
  }

  const accessToken = decrypt(plaidItem.accessToken)

  return NextResponse.json({ accessToken })
}
