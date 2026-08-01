export const metadata = {
  title: 'Cash Flow Visionaries',
  description: 'Network Leveraging Cash Flow - Founders Beta',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
