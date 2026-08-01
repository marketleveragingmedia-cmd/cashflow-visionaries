import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    
    const sessionId = formData.get('sessionId') as string
    const fullName = formData.get('fullName') as string
    const preferredName = formData.get('preferredName') as string | null
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const addressLine1 = formData.get('addressLine1') as string
    const addressLine2 = formData.get('addressLine2') as string | null
    const city = formData.get('city') as string
    const stateProvince = formData.get('stateProvince') as string
    const postalCode = formData.get('postalCode') as string
    const country = formData.get('country') as string
    const preferredContactMethod = formData.get('preferredContactMethod') as string

    if (!sessionId) {
      return NextResponse.redirect(new URL('/founders-beta/participate.html', req.url))
    }

    // Find existing founder record
    const founder = await prisma.founderBeta.findUnique({
      where: { stripeCheckoutSessionId: sessionId }
    })

    if (!founder) {
      return NextResponse.redirect(new URL('/founders-beta/participate.html', req.url))
    }

    // Update the founder record (do NOT create a duplicate)
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
        // Preserve all verified Stripe payment fields
        // founderLevel, amountPaid, paymentStatus, etc. are NOT modified
      },
    })

    // Redirect to completion page
    return NextResponse.redirect(new URL('/founders-beta/intake-complete', req.url))

  } catch (error: any) {
    console.error('❌ Error processing intake:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
