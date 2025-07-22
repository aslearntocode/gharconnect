'use client'

import Header from "@/components/Header"
import { useState } from "react"

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is GharConnect and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GharConnect is a platform that connects you with trusted home service providers in your area. We offer services like laundry, carpentry, plumbing, electrical work, cleaning, and painting. Simply select the service you need, choose a provider, and book your service through our platform."
        }
      },
      {
        "@type": "Question",
        "name": "How do I book a service on GharConnect?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Booking a service is easy:\n1. Select the service category you need\n2. Browse through available service providers\n3. Check their ratings, reviews, and pricing\n4. Choose your preferred provider and time slot\n5. Complete the booking through our secure platform"
        }
      },
      // Add more FAQ items...
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Find answers to common questions about our home services and how to use GharConnect.
        </p>
        
        <div className="space-y-6">
          <section>
            <div className="space-y-4">
              {[
                {
                  question: "What is GharConnect and how does it work?",
                  answer: "GharConnect is a platform that connects you with trusted home service providers in your area. We offer services like laundry, carpentry, plumbing, electrical work, cleaning, and painting. Simply select the service you need, choose a provider, and book your service through our platform."
                },
                {
                  question: "How do I book a service on GharConnect?",
                  answer: (
                    <div>
                      Booking a service is easy:
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Select the service category you need</li>
                        <li>Browse through available service providers</li>
                        <li>Check their ratings, reviews, and pricing</li>
                        <li>Choose your preferred provider and time slot</li>
                        <li>Complete the booking through our secure platform</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "What services are available on GharConnect?",
                  answer: (
                    <div>
                      We offer a wide range of home services:
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Laundry and Dry Cleaning</li>
                        <li>Carpentry and Furniture Repair</li>
                        <li>Plumbing Services</li>
                        <li>Electrical Repairs and Installations</li>
                        <li>House Cleaning</li>
                        <li>Painting Services</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "How are service providers verified?",
                  answer: (
                    <div>
                      We ensure quality service through a rigorous verification process:
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Background checks and identity verification</li>
                        <li>Skill assessment and experience verification</li>
                        <li>Customer feedback and rating system</li>
                        <li>Regular performance monitoring</li>
                        <li>Quality assurance checks</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "What if I'm not satisfied with the service?",
                  answer: "We have a 100% satisfaction guarantee. If you're not satisfied with the service, please contact our customer support team within 24 hours of service completion. We'll work with you to resolve the issue and ensure your satisfaction."
                },
                {
                  question: "How do I pay for services?",
                  answer: (
                    <div>
                      We offer multiple secure payment options:
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Online payment through our secure platform</li>
                        <li>Credit/Debit cards</li>
                        <li>UPI payments</li>
                        <li>Net banking</li>
                        <li>Cash on service completion (for select services)</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "How can I contact customer support?",
                  answer: "You can reach our customer support team through multiple channels:\n1. Call us at +91 93213 14553\n2. WhatsApp us at the same number\n3. Email us at gharconnectindia@gmail.com\nOur support team is available Monday to Saturday, 9 AM to 6 PM."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center"
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <span className={`ml-4 flex-shrink-0 transition-transform duration-200 ${openQuestion === index ? 'rotate-180' : ''}`}>
                      <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className={`px-6 transition-all duration-200 ease-in-out ${openQuestion === index ? 'py-4 border-t border-gray-200' : 'max-h-0 overflow-hidden'}`}>
                    <div className="text-gray-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 