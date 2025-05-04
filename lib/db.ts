// lib/db.ts
import { prisma } from '@/lib/prisma'

/**
 * Retrieve the encrypted access token for a given user.
 */
export async function getAccessTokenForUser(userId: string): Promise<string | null> {
  const plaidItem = await prisma.plaidItem.findUnique({
    where: { userId },
    select: { accessToken: true },
  })

  return plaidItem?.accessToken ?? null
}

/**
 * Create or update the PlaidItem record for a user, storing both the access token and item id.
 * 
 * @param userId - The user's ID
 * @param accessToken - The Plaid access token to store
 * @param itemId - The Plaid item ID associated with the access token
 */
export async function savePlaidItemForUser(
  userId: string,
  accessToken: string,
  itemId: string
): Promise<void> {
  await prisma.plaidItem.upsert({
    where: { userId },
    update: {
      accessToken,
      itemId,
    },
    create: {
      accessToken,
      itemId,
      user: { connect: { id: userId } },
    },
  })
}
