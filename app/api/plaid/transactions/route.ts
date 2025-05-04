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
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // 1 month ago
    const endDate = new Date();

    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    });

    return NextResponse.json({ transactions: response.data.transactions });
  } catch (err) {
    console.error('Plaid transactionsGet error:', err);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
