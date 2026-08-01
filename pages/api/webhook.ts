import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  if (!sig) {
    return res.status(400).json({ error: 'No signature' })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Determine Founder-Beta Level from Price ID
    let founderLevel = 'Unknown'
    const priceId = session.line_items?.data[0]?.price?.id
    if (priceId === process.env.STRIPE_CITIZEN_PRICE_ID) {
      founderLevel = 'Citizen Founder-Beta'
    } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
      founderLevel = 'Enterprise Founder-Beta'
    }

    try {
      // Check for duplicate
      const existing = await prisma.founderBeta.findUnique({
        where: { stripeCheckoutSessionId: session.id },
      })

      if (existing) {
        console.log('Duplicate webhook event, skipping:', session.id)
        return res.status(200).json({ received: true, duplicate: true })
      }

      // Create Founder record
      await prisma.founderBeta.create({
        data: {
          fullName: session.customer_details?.name || '',
          email: session.customer_details?.email || '',
          phone: session.customer_details?.phone || null,
          founderLevel,
          amountPaid: session.amount_total || 0,
          currency: session.currency || 'usd',
          paymentStatus: session.payment_status,
          stripeCustomerId: session.customer as string,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          transactionDate: new Date(session.created * 1000),
        },
      })

      console.log('Founder record created:', session.id)
      return res.status(200).json({ received: true })
    } catch (error: any) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  return res.status(200).json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
