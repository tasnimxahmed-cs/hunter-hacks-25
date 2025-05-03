'use client'

import { useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'

interface PlaidLinkButtonProps {
  onLinkSuccess?: () => void // for parent to update hasPlaid state
}

export default function PlaidLinkButton({ onLinkSuccess }: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch('/api/create-link-token')
        if (!res.ok) throw new Error('Failed to fetch link token')

        const data: { linkToken: string } = await res.json()
        setLinkToken(data.linkToken)
      } catch (err) {
        console.error(err)
        setError('Error creating link token. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        console.log('Public token:', public_token)
        const res = await fetch('/api/exchange-public-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_token }),
        })

        if (!res.ok) throw new Error('Token exchange failed')

        onLinkSuccess?.() // Tell parent component to refetch dashboard state
      } catch (err) {
        console.error('Plaid token exchange error:', err)
        setError('There was an issue linking your account. Try again.')
      }
    },
    onExit: (err, metadata) => {
      if (err) console.error('Plaid Link exited with error:', err)
    },
  })

  if (loading) return <p>Loading Plaid...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {ready ? 'Link your bank' : 'Initializing...'}
    </button>
  )
}
