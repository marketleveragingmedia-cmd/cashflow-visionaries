import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Stripe product/price IDs for Founder-Beta tiers
const CITIZEN_PRICE_ID = process.env.STRIPE_CITIZEN_PRICE_ID!
const ENTERPRISE_PRICE_ID = process.env.STRIPE_ENTERPRISE_PRICE_ID!

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('⚠️  Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Check if this session was already processed (prevent duplicates)
      const existing = await prisma.founderBeta.findUnique({
        where: { stripeCheckoutSessionId: session.id }
      })

      if (existing) {
        console.log('✅ Session already processed:', session.id)
        return NextResponse.json({ received: true, status: 'already_processed' })
      }

      // Retrieve line items to determine Founder-Beta Level
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      const priceId = lineItems.data[0]?.price?.id

      let founderLevel: string
      if (priceId === CITIZEN_PRICE_ID) {
        founderLevel = 'Citizen Founder-Beta'
      } else if (priceId === ENTERPRISE_PRICE_ID) {
        founderLevel = 'Enterprise Founder-Beta'
      } else {
        console.error('❌ Unknown price ID:', priceId)
        return NextResponse.json({ error: 'Unknown product' }, { status: 400 })
      }

      // Extract customer details
      const customerEmail = session.customer_details?.email || session.customer_email
      const customerName = session.customer_details?.name || ''
      const customerPhone = session.customer_details?.phone || null

      const address = session.customer_details?.address
      
      // Create Founder-Beta record
      const founder = await prisma.founderBeta.create({
        data: {
          fullName: customerName,
          email: customerEmail!,
          phone: customerPhone,
          addressLine1: address?.line1 || null,
          addressLine2: address?.line2 || null,
          city: address?.city || null,
          stateProvince: address?.state || null,
          postalCode: address?.postal_code || null,
          country: address?.country || null,
          founderLevel,
          amountPaid: session.amount_total || 0,
          currency: session.currency?.toUpperCase() || 'USD',
          paymentStatus: session.payment_status,
          stripeCustomerId: session.customer as string || null,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string || null,
          transactionDate: new Date(session.created * 1000),
          founderIntakeStatus: 'Pending',
          founderOrientationStatus: 'Not Started',
        },
      })

      console.log('✅ Founder-Beta record created:', founder.id, founderLevel)

      return NextResponse.json({ 
        received: true, 
        founderId: founder.id,
        founderLevel 
      })

    } catch (error: any) {
      console.error('❌ Error creating Founder record:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
