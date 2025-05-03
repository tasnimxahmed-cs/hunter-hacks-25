import { NextRequest, NextResponse } from 'next/server'
import { plaidClient } from '@/lib/plaid'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/crypto'

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { public_token } = await req.json()

    if (!public_token) {
      return new NextResponse("Missing public token", { status: 400 })
    }

    const response = await plaidClient.itemPublicTokenExchange({ public_token })
    const access_token = response.data.access_token
    const item_id = response.data.item_id
    const encryptedAccessToken = encrypt(access_token)

    await prisma.plaidItem.upsert({
      where: { userId: session.user.id },
      update: {
        accessToken: encryptedAccessToken,
        itemId: item_id,
      },
      create: {
        accessToken: encryptedAccessToken,
        itemId: item_id,
        user: {
          connect: { id: session.user.id },
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error exchanging public token:", error.response?.data || error.message)
    return new NextResponse("Something went wrong", { status: 500 })
  }
}
