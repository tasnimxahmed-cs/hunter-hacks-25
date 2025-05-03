import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ linked: false })

  const plaidItem = await prisma.plaidItem.findFirst({ where: { userId } })
  return NextResponse.json({ linked: Boolean(plaidItem) })
}
