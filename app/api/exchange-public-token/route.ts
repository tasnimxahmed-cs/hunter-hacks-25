import { NextResponse } from 'next/server'
import { plaidClient } from '@/lib/plaid'
import { savePlaidItemForUser } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { public_token, userId } = await req.json()

    if (!public_token || !userId) {
      return NextResponse.json({ error: 'Missing public_token or userId' }, { status: 400 })
    }

    // Exchange the public token for an access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({ public_token })
    const accessToken = response.data.access_token
    const itemId = response.data.item_id

    // Save both values in the database
    await savePlaidItemForUser(userId, accessToken, itemId)

    return NextResponse.json({ message: 'Plaid item saved' })
  } catch (error: any) {
    console.error('Plaid exchange error:', error.response?.data || error.message)
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 })
  }
}
