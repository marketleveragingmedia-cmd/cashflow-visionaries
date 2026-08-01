import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ verified: false, error: 'Method not allowed' })
  }

  const sessionId = req.query.session_id as string

  if (!sessionId) {
    return res.status(400).json({ verified: false, error: 'No session ID' })
  }

  try {
    const founder = await prisma.founderBeta.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        founderLevel: true,
        paymentStatus: true,
        founderIntakeStatus: true,
      },
    })

    if (!founder) {
      return res.status(404).json({ verified: false, error: 'Not found' })
    }

    return res.status(200).json({
      verified: true,
      ...founder,
    })
  } catch (error: any) {
    console.error('Error verifying founder:', error)
    return res.status(500).json({ verified: false, error: 'Database error' })
  }
}
