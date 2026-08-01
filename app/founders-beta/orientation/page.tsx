export default function OrientationPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Founder Orientation | Cash Flow Visionaries</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: "Montserrat", Arial, sans-serif;
            background: #F9F6F0;
            color: #1A1A1A;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 40px 20px;
          }
          .card {
            background: white;
            border: 2px solid #C9A961;
            border-radius: 16px;
            padding: 48px;
            text-align: center;
            max-width: 600px;
          }
          h1 {
            color: #0F4C35;
            font-size: 2rem;
            margin-bottom: 16px;
          }
          p {
            color: #5B6E64;
            font-size: 1.05rem;
            line-height: 1.6;
          }
        `}</style>
      </head>
      <body>
        <div className="card">
          <h1>Founder Orientation</h1>
          <p>Your Founder Orientation experience is being prepared.</p>
          <p style={{marginTop: '16px'}}>You will receive an email with your next steps.</p>
        </div>
      </body>
    </html>
  )
}
