'use client'

import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import Script from 'next/script'
import Link from 'next/link'

export default function SecuredCreditCardArticle() {
    // Define structured data for the article
    const articleStructuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Why a Secured Credit Card Can Be a Game Changer for Parents of College-Bound Kids",
      "description": "Learn how secured credit cards can help college students build credit history, earn rewards, and develop financial discipline while giving parents peace of mind.",
      "author": {
        "@type": "Organization",
        "name": "Financial Health"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Financial Health",
        "logo": {
          "@type": "ImageObject",
          "url": "https://financialhealth.co.in/Logo_Final3.jpeg"
        }
      },
      "datePublished": "2025-02-24",
      "dateModified": "2025-02-24",
      "image": "https://financialhealth.co.in/SecuredCard.png",
      "articleSection": "Credit Cards",
      "url": "https://financialhealth.co.in/learning-center/credit-cards/secured-credit-card",
      "timeRequired": "8 min read",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://financialhealth.co.in/learning-center/credit-cards/secured-credit-card"
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Add structured data script */}
        <Script
          id="article-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
        />

        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Why a Secured Credit Card Can Be a Game Changer for Parents of College-Bound Kids</h1>
            <div className="flex items-center text-sm">
              <span className="mr-4">8 min read</span>
              <span className="bg-blue-500 px-3 py-1 rounded-full text-xs">Credit Cards</span>
            </div>
          </div>
        </div>
  
        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <Link href="/learning-center" className="inline-flex items-center text-blue-600 hover:underline font-medium mb-4">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Travel Vlogs
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            As children step into adulthood and head off to college, one of the biggest concerns for parents is ensuring their kids develop good financial habits. Teaching financial discipline early can set the foundation for a lifetime of responsible money management. One of the smartest tools to achieve this is a secured credit card, especially tailored for college students.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">What Is a Secured Credit Card?</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <p className="text-gray-700 leading-relaxed">
              A secured credit card is backed by a fixed deposit (FD) made with the issuing bank. The credit limit is typically a percentage of the FD amount—this ensures spending is always within a controlled boundary. Unlike unsecured cards, which require no collateral, secured credit cards offer a low-risk and practical way for students to learn money management.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">Why Should Parents Consider a Secured Credit Card for Their College-Going Kids?</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">1. Teaches Financial Discipline Through Controlled Limits</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Financial discipline isn't about saying "no" all the time—it's about learning to make better choices within set limits. A secured credit card does just that. Since the credit limit is tied to the FD, parents can decide how much their child can spend, preventing them from overspending or accumulating debt.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  ✅ For example: An FD of ₹20,000 can get a credit limit of ₹16,000 – enough for essential monthly expenses, not impulse shopping sprees.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">2. Starts Building Credit History Early</h3>
              <p className="text-gray-700 leading-relaxed">
                In India, many young adults enter the workforce without any credit history, making it difficult to get loans, buy vehicles, or apply for credit cards. A secured credit card allows students to start building their credit score while still in college.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Timely repayments on small purchases add up over time, helping them graduate not only with a degree but also with a healthy credit score.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">3. Earn Rewards While Spending</h3>
              <p className="text-gray-700 leading-relaxed">
                Many banks offer reward points, cashback, and other benefits on secured credit cards—similar to those on unsecured cards. Whether it's buying books, ordering groceries, or paying for online courses, students can make the most of their expenses.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                At the same time, the FD continues to earn interest, making this a win-win situation for parents and kids alike.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">4. Reduces Risk Compared to Unsecured Student Credit Cards</h3>
              <p className="text-gray-700 leading-relaxed">
                Some banks and fintech platforms offer unsecured credit cards to college students. While this might seem convenient, it's often risky. Without collateral or a stable income, students may splurge beyond their means, leading to missed payments, penalties, and damaged credit scores.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                A secured credit card helps build good habits instead of letting poor choices snowball into long-term financial consequences.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">How Parents Can Set This Up</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <ul className="list-decimal list-inside text-gray-700 space-y-3">
              <li>Choose a reputed bank offering secured credit cards backed by FDs.</li>
              <li>Open a fixed deposit in your child's name or jointly.</li>
              <li>Apply for a secured credit card with a modest credit limit.</li>
              <li>Educate your child on how credit cards work—especially interest, repayment cycles, and due dates.</li>
              <li>Monitor and review spending monthly as a family learning exercise.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">Final Thoughts</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <p className="text-gray-700 leading-relaxed">
              A secured credit card is more than just a financial product—it's a teaching tool. It helps college students learn responsibility, earn rewards, and start building their financial future with the right mindset. For parents, it offers peace of mind and a practical way to stay involved in their child's financial journey.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By investing in a secured credit card backed by an FD, you're not just controlling spending—you're empowering your child with financial independence and creditworthiness.
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Secured Credit Card for Students',
                'Credit Card for College Kids',
                'How to Build Credit History Early',
                'Teach Kids Financial Discipline',
                'Best Credit Card for Beginners in India',
                'Financial Tips for Parents'
              ].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
}
