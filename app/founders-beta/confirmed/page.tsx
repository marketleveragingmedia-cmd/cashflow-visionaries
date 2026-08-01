import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect('/founders-beta/participate.html')
  }

  // Server-side verification: Check if this session has a verified Founder record
  const founder = await prisma.founderBeta.findUnique({
    where: { stripeCheckoutSessionId: sessionId },
  })

  if (!founder || founder.paymentStatus !== 'paid') {
    redirect('/founders-beta/participate.html')
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Welcome, Founding Visionary | Cash Flow Visionaries</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --green: #1E8E5A;
            --green-dark: #0A5D39;
            --green-deep: #063B25;
            --forest: #0F4C35;
            --gold: #C9A441;
            --gold-rich: #C9A961;
            --gold-light: #E6CF87;
            --white: #FFFFFF;
            --cream: #F9F6F0;
            --ink: #1A1A1A;
            --muted: #5B6E64;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: "Montserrat", Arial, sans-serif;
            background: var(--cream);
            color: var(--ink);
            line-height: 1.6;
          }
          .container { width: min(800px, calc(100% - 40px)); margin: 0 auto; }
          
          header {
            background: var(--white);
            border-bottom: 1px solid rgba(220,236,226,.5);
            padding: 20px 0;
          }
          .brand-logo { height: 56px; }
          
          .hero {
            background: linear-gradient(135deg, var(--forest) 0%, var(--green-dark) 100%);
            padding: 80px 0;
            text-align: center;
            color: var(--white);
          }
          .hero-eyebrow {
            color: var(--gold-light);
            font-size: .7rem;
            font-weight: 800;
            letter-spacing: .18em;
            text-transform: uppercase;
            margin-bottom: 16px;
          }
          .hero h1 {
            font-size: clamp(2rem, 4vw, 3.2rem);
            font-weight: 700;
            margin-bottom: 24px;
            letter-spacing: -.02em;
          }
          .hero-subtitle {
            font-size: 1.1rem;
            color: rgba(255,255,255,.9);
            max-width: 600px;
            margin: 0 auto 32px;
          }
          .hero-level {
            display: inline-block;
            background: rgba(255,255,255,.15);
            border: 2px solid var(--gold-light);
            border-radius: 12px;
            padding: 16px 32px;
            margin-top: 16px;
          }
          .hero-level-label {
            font-size: .75rem;
            color: var(--gold-light);
            font-weight: 800;
            letter-spacing: .12em;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          .hero-level-value {
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--white);
          }
          
          .content {
            background: var(--white);
            padding: 64px 0;
          }
          .content h2 {
            color: var(--forest);
            font-size: 1.8rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 24px;
          }
          .content p {
            font-size: 1.05rem;
            color: var(--muted);
            text-align: center;
            max-width: 640px;
            margin: 0 auto 40px;
          }
          .cta-btn {
            display: inline-block;
            background: linear-gradient(135deg, #C9A961, #B8954F);
            color: var(--white);
            padding: 18px 36px;
            border-radius: 10px;
            font-weight: 800;
            font-size: .95rem;
            letter-spacing: .06em;
            text-transform: uppercase;
            text-decoration: none;
            box-shadow: 0 6px 20px rgba(201,169,97,.3);
            transition: all .3s ease;
          }
          .cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 32px rgba(201,169,97,.4);
          }
          .cta-wrapper {
            text-align: center;
          }
          
          .closing {
            background: var(--cream);
            padding: 48px 0;
            text-align: center;
            color: var(--muted);
            font-size: .95rem;
            font-weight: 500;
          }
        `}</style>
      </head>
      <body>
        <header>
          <div className="container">
            <a href="/">
              <img
                src="/assets/cash-flow-visionaries-logo.jpg"
                alt="Cash Flow Visionaries"
                className="brand-logo"
              />
            </a>
          </div>
        </header>

        <section className="hero">
          <div className="container">
            <div className="hero-eyebrow">Network Leveraging Cash Flow</div>
            <h1>WELCOME, FOUNDING VISIONARY</h1>
            <p className="hero-subtitle">
              Your Founder-Beta Participation Is Confirmed.
            </p>
            <p className="hero-subtitle">
              You have officially taken the next step in helping Establish the
              Foundation of the Cash Flow Visionaries Movement.
            </p>
            <div className="hero-level">
              <div className="hero-level-label">Your Founder-Beta Level</div>
              <div className="hero-level-value">{founder.founderLevel}</div>
            </div>
          </div>
        </section>

        <section className="content">
          <div className="container">
            <h2>Next Step</h2>
            <p>
              Your next step is to complete your Founder Intake and begin Founder
              Orientation.
            </p>
            <div className="cta-wrapper">
              <a href={`/founders-beta/intake?session_id=${sessionId}`} className="cta-btn">
                Complete Your Founder Intake
              </a>
            </div>
          </div>
        </section>

        <section className="closing">
          <div className="container">
            <p>Connecting One Cash Flow Visionary at a Time.</p>
          </div>
        </section>
      </body>
    </html>
  )
}
