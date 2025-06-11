import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resolve Financial Complaints | Credit Card & Loan Issues',
  description: 'Register and track your financial complaints. Get expert assistance for credit card, loan, and banking issues. Our team helps resolve disputes with banks and financial institutions.',
  openGraph: {
    title: 'Resolve Financial Complaints | Credit Card & Loan Issues',
    description: 'Register and track your financial complaints. Get expert assistance for credit card, loan, and banking issues. Our team helps resolve disputes with banks and financial institutions.',
    url: 'https://financialhealth.co.in/resolve-complaints',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resolve Financial Complaints | Credit Card & Loan Issues',
    description: 'Register and track your financial complaints. Get expert assistance for credit card, loan, and banking issues. Our team helps resolve disputes with banks and financial institutions.',
  }
}

export default function ResolveComplaintsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 