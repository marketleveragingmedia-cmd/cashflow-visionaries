import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function IntakePage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect('/founders-beta/participate.html')
  }

  const founder = await prisma.founderBeta.findUnique({
    where: { stripeCheckoutSessionId: sessionId },
  })

  if (!founder || founder.paymentStatus !== 'paid') {
    redirect('/founders-beta/participate.html')
  }

  // If already complete, redirect to orientation
  if (founder.founderIntakeStatus === 'Complete') {
    return redirect('/founders-beta/orientation')
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Founder Intake | Cash Flow Visionaries</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --green: #1E8E5A;
            --forest: #0F4C35;
            --gold-rich: #C9A961;
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
          .container { width: min(720px, calc(100% - 40px)); margin: 0 auto; }
          
          header {
            background: var(--white);
            border-bottom: 1px solid rgba(220,236,226,.5);
            padding: 20px 0;
          }
          .brand-logo { height: 56px; }
          
          .content {
            padding: 64px 0;
          }
          h1 {
            color: var(--forest);
            font-size: 2.2rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 16px;
          }
          .subtitle {
            text-align: center;
            color: var(--muted);
            font-size: 1.05rem;
            margin-bottom: 48px;
          }
          
          .form-card {
            background: var(--white);
            border: 2px solid var(--gold-rich);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 6px 24px rgba(15,76,53,.08);
          }
          .form-group {
            margin-bottom: 24px;
          }
          label {
            display: block;
            color: var(--forest);
            font-weight: 600;
            font-size: .9rem;
            margin-bottom: 8px;
          }
          label .required {
            color: #C94441;
            margin-left: 4px;
          }
          input, select, textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #E5E5E5;
            border-radius: 8px;
            font-size: 1rem;
            font-family: inherit;
            transition: border-color .3s ease;
          }
          input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--gold-rich);
          }
          input:read-only {
            background: #F5F5F5;
            color: var(--muted);
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .readonly-note {
            font-size: .85rem;
            color: var(--muted);
            font-style: italic;
            margin-top: 6px;
          }
          .submit-btn {
            width: 100%;
            background: linear-gradient(135deg, #C9A961, #B8954F);
            color: var(--white);
            padding: 16px;
            border: none;
            border-radius: 10px;
            font-weight: 800;
            font-size: .95rem;
            letter-spacing: .06em;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(201,169,97,.3);
            transition: all .3s ease;
            margin-top: 32px;
          }
          .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 32px rgba(201,169,97,.4);
          }
          
          @media(max-width: 768px) {
            .form-row { grid-template-columns: 1fr; }
          }
        `}</style>
      </head>
      <body>
        <header>
          <div className="container">
            <a href="/">
              <img src="/assets/cash-flow-visionaries-logo.jpg" alt="Cash Flow Visionaries" className="brand-logo" />
            </a>
          </div>
        </header>

        <section className="content">
          <div className="container">
            <h1>Founder Intake</h1>
            <p className="subtitle">
              Complete your information to begin your Founder-Beta experience.
            </p>

            <form className="form-card" action="/api/intake" method="POST">
              <input type="hidden" name="sessionId" value={sessionId} />

              <div className="form-group">
                <label>
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={founder.fullName}
                  required
                />
              </div>

              <div className="form-group">
                <label>Preferred Name</label>
                <input
                  type="text"
                  name="preferredName"
                  defaultValue={founder.preferredName || ''}
                  placeholder="What should we call you?"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={founder.email}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={founder.phone || ''}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Address Line 1 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  defaultValue={founder.addressLine1 || ''}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  defaultValue={founder.addressLine2 || ''}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    defaultValue={founder.city || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    State / Province <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="stateProvince"
                    defaultValue={founder.stateProvince || ''}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Postal Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    defaultValue={founder.postalCode || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Country <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={founder.country || 'United States'}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Preferred Contact Method <span className="required">*</span>
                </label>
                <select name="preferredContactMethod" required>
                  <option value="">Select...</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Text">Text Message</option>
                </select>
              </div>

              <div className="form-group">
                <label>Founder-Beta Level</label>
                <input
                  type="text"
                  value={founder.founderLevel}
                  readOnly
                />
                <p className="readonly-note">
                  Your Founder-Beta Level is verified from your purchase and cannot be changed.
                </p>
              </div>

              <button type="submit" className="submit-btn">
                Complete Founder Intake
              </button>
            </form>
          </div>
        </section>
      </body>
    </html>
  )
}
