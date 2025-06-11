import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Check Your Credit Score | Free Credit Report Analysis',
  description: 'Get your free credit score analysis and detailed credit report. Understand your credit health, identify areas for improvement, and get personalized recommendations to boost your credit score.',
  openGraph: {
    title: 'Check Your Credit Score | Free Credit Report Analysis',
    description: 'Get your free credit score analysis and detailed credit report. Understand your credit health, identify areas for improvement, and get personalized recommendations to boost your credit score.',
    url: 'https://financialhealth.co.in/credit-score',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Check Your Credit Score | Free Credit Report Analysis',
    description: 'Get your free credit score analysis and detailed credit report. Understand your credit health, identify areas for improvement, and get personalized recommendations to boost your credit score.',
  }
}

export default function CreditScoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 