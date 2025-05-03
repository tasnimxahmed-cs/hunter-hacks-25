import { NextResponse } from 'next/server'
import { plaidClient } from '@/lib/plaid'
import { CountryCode, Products } from 'plaid'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: session.user.id,
      },
      client_name: 'Waddle',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('Generated Plaid Link Token:', response.data.link_token)
    }

    return NextResponse.json({
      success: true,
      linkToken: response.data.link_token,
    })
  } catch (error: any) {
    console.error("Plaid link token creation error:", error.response?.data || error.message)
    return new NextResponse("Failed to create link token", { status: 500 })
  }
}
