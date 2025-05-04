import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { getAccessTokenForUser } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  const accessToken = await getAccessTokenForUser(userId);
  if (!accessToken) return NextResponse.json({ error: 'No access token found' }, { status: 404 });

  try {
    const response = await plaidClient.accountsGet({ access_token: accessToken });
    return NextResponse.json({ accounts: response.data.accounts });
  } catch (err) {
    console.error('Plaid accountsGet error:', err);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
