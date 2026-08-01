export default function IntakeCompletePage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Intake Complete | Cash Flow Visionaries</title>
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
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          .container { width: min(720px, calc(100% - 40px)); margin: 0 auto; }
          
          header {
            background: var(--white);
            border-bottom: 1px solid rgba(220,236,226,.5);
            padding: 20px 0;
          }
          .brand-logo { height: 56px; }
          
          .content {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 64px 0;
          }
          .success-card {
            background: var(--white);
            border: 2px solid var(--gold-rich);
            border-radius: 16px;
            padding: 56px 48px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(15,76,53,.08);
          }
          .checkmark {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #1E8E5A, #0A5D39);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
          }
          h1 {
            color: var(--forest);
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 20px;
          }
          p {
            color: var(--muted);
            font-size: 1.08rem;
            line-height: 1.7;
            margin-bottom: 16px;
          }
          p.closing {
            margin-top: 32px;
            font-weight: 500;
            color: var(--green);
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
            <div className="success-card">
              <div className="checkmark">✓</div>
              <h1>FOUNDER INTAKE COMPLETE</h1>
              <p>Your Founder-Beta information has been received.</p>
              <p>Your next step is Founder Orientation.</p>
              <p>Watch your email and Founding Member area for your next instructions.</p>
              <p className="closing">Connecting One Cash Flow Visionary at a Time.</p>
            </div>
          </div>
        </section>
      </body>
    </html>
  )
}
