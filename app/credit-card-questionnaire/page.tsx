export const metadata = {
  title: 'Credit Card Recommendation Questionnaire | Financial Health',
  description: 'Answer a few simple questions to get personalized credit card recommendations based on your spending habits, preferences, and financial profile. Find the best credit card for you in India.',
  alternates: {
    canonical: 'https://www.financialhealth.co.in/credit-card-questionnaire',
  },
};

import Header from "@/components/Header"
import CreditCardQuestionnaire from "@/components/CreditCardQuestionnaire"

export default function CreditCardQuestionnairePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Find Your Perfect Credit Card</h1>
              <p className="text-lg md:text-xl text-white/90 mb-4 text-center">
                Answer a few simple questions and we'll help you find the right credit card for your needs
              </p>
            </div>
          </div>
        </section>

        {/* Questionnaire Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CreditCardQuestionnaire />
          </div>
        </section>
      </main>
    </div>
  )
} 