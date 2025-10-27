import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recruiter Dashboard — Candidate AI PoC',
  description: 'Evaluate candidates with serverless scoring.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto p-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Recruiter Dashboard</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
