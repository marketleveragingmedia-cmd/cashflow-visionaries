import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const {
    sessionId,
    fullName,
    preferredName,
    email,
    phone,
    addressLine1,
    addressLine2,
    city,
    stateProvince,
    postalCode,
    country,
    preferredContactMethod,
  } = req.body

  if (!sessionId) {
    return res.status(400).json({ success: false, error: 'No session ID' })
  }

  try {
    const founder = await prisma.founderBeta.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
    })

    if (!founder) {
      return res.status(404).json({ success: false, error: 'Founder not found' })
    }

    await prisma.founderBeta.update({
      where: { id: founder.id },
      data: {
        fullName,
        preferredName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        stateProvince,
        postalCode,
        country,
        preferredContactMethod,
        founderIntakeStatus: 'Complete',
      },
    })

    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Intake error:', error)
    return res.status(500).json({ success: false, error: 'Database error' })
  }
}
