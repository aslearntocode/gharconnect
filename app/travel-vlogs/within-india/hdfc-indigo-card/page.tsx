'use client'

import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import Script from 'next/script'
import { JSX } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function HDFCIndiGoCard(): JSX.Element {
    const articleStructuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Best Domestic Travel Credit Cards in India: A Review of HDFC IndiGo 6E Rewards Credit Cards",
        "description": "Compare HDFC Bank IndiGo 6E Rewards Credit Cards - the best domestic travel credit cards in India. Learn about rewards, benefits, eligibility & more.",
        "author": {
            "@type": "Organization",
            "name": "Financial Health"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Financial Health",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.financialhealth.co.in/logo.png"
            }
        },
        "datePublished": "2024-03-20",
        "dateModified": "2024-03-20",
        "image": "https://financialhealth.co.in/CreditCards.png",
        "articleSection": "Credit Cards",
        "url": "https://financialhealth.co.in/learning-center/credit-cards/hdfc-indigo-card",
        "timeRequired": "8 min read",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://financialhealth.co.in/learning-center/credit-cards/hdfc-indigo-card"
        },
        "keywords": "HDFC Bank, IndiGo, 6E Rewards, credit card rewards, travel credit cards, domestic flights, airport lounge access",
        "articleBody": "Compare HDFC Bank IndiGo 6E Rewards Credit Cards - the best domestic travel credit cards in India. Learn about rewards, benefits, eligibility & more."
    }

    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "Can I use the 6E Rewards for any airline?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, 6E Rewards are redeemable only on IndiGo flights and its platform add-ons."
            }
        }, {
            "@type": "Question",
            "name": "Is it worth upgrading to the XL version?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, if you travel frequently and can benefit from lounge access and higher reward rates."
            }
        }, {
            "@type": "Question",
            "name": "How to apply for the HDFC IndiGo credit card?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can apply online via HDFC Bank's website or at goindigo.in/6e-rewards."
            }
        }]
    }

    return (
        <>
            <Head>
                <title>HDFC IndiGo 6E Rewards Credit Cards Review | Best Domestic Travel Cards | Financial Health</title>
                <meta name="description" content="Compare HDFC Bank IndiGo 6E Rewards Credit Cards - the best domestic travel credit cards in India. Learn about rewards, benefits, eligibility & more." />
                <meta name="keywords" content="HDFC Bank, IndiGo, 6E Rewards, credit card rewards, travel credit cards, domestic flights, airport lounge access" />
                <meta property="og:title" content="HDFC IndiGo 6E Rewards Credit Cards Review | Best Domestic Travel Cards" />
                <meta property="og:description" content="Compare HDFC Bank IndiGo 6E Rewards Credit Cards - the best domestic travel credit cards in India. Learn about rewards, benefits, eligibility & more." />
                <meta property="og:image" content="https://financialhealth.co.in/CreditCards.png" />
                <meta property="og:url" content="https://financialhealth.co.in/learning-center/credit-cards/hdfc-indigo-card" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://financialhealth.co.in/learning-center/credit-cards/hdfc-indigo-card" />
            </Head>

            <Script
                id="article-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
            />
            <Script
                id="faq-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
            />

            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                <Header />
                
                <main>
                    {/* Hero Section */}
                    <section aria-label="Article Header" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
                        <div className="max-w-6xl mx-auto px-4">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">HDFC IndiGo 6E Rewards Credit Cards Review</h1>
                            <div className="flex items-center text-sm">
                                <time dateTime="2024-03-20" className="mr-4">8 min read</time>
                                <span className="bg-blue-500 px-3 py-1 rounded-full text-xs">All</span>
                            </div>
                        </div>
                    </section>

                    {/* Back Button */}
                    <div className="max-w-6xl mx-auto px-4 mt-4">
                        <Link href="/learning-center" className="inline-flex items-center text-blue-600 hover:underline font-medium mb-4">
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Travel Vlogs
                        </Link>
                    </div>

                    <article className="max-w-6xl mx-auto px-4 py-8">
                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                            If you're a frequent flyer within India, finding the right credit card to save money on flights and earn rewards can make all the difference. One of the top choices for domestic flyers is the HDFC Bank IndiGo 6E Rewards Credit Card series, co-branded with IndiGo Airlines.
                        </p>

                        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">🧭 Why Choose a Travel Credit Card for Domestic Flights?</h2>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Domestic travel in India is booming, and with airlines like IndiGo offering extensive coverage, frequent flyers stand to benefit significantly from cards that offer:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Flight discounts</li>
                                <li>Reward points on bookings</li>
                                <li>Priority services and add-ons</li>
                                <li>Complimentary vouchers and perks</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                The HDFC-IndiGo credit cards offer just that—tailored benefits for IndiGo flyers with unmatched value.
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">🎉 Overview of HDFC IndiGo Credit Cards</h2>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-8 rounded-lg border border-blue-100 mb-8">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-white">
                                            <th className="px-4 py-3 text-left">Feature</th>
                                            <th className="px-4 py-3 text-left">6E Rewards</th>
                                            <th className="px-4 py-3 text-left">6E Rewards XL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="px-4 py-3">IndiGo Booking Rewards</td>
                                            <td className="px-4 py-3">2.5% 6E Rewards</td>
                                            <td className="px-4 py-3">5% 6E Rewards</td>
                                        </tr>
                                        <tr className="border-b bg-gray-50">
                                            <td className="px-4 py-3">Other Spend Categories</td>
                                            <td className="px-4 py-3">1–2%</td>
                                            <td className="px-4 py-3">2–3%</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-3">Welcome Benefit</td>
                                            <td className="px-4 py-3">Free IndiGo flight ticket + 6E Prime</td>
                                            <td className="px-4 py-3">Free IndiGo flight ticket + 6E Prime</td>
                                        </tr>
                                        <tr className="border-b bg-gray-50">
                                            <td className="px-4 py-3">Annual Fee</td>
                                            <td className="px-4 py-3">₹500 + GST</td>
                                            <td className="px-4 py-3">₹1,500 + GST</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-3">Airport Lounge Access</td>
                                            <td className="px-4 py-3">❌</td>
                                            <td className="px-4 py-3">✅ 4/year</td>
                                        </tr>
                                        <tr className="border-b bg-gray-50">
                                            <td className="px-4 py-3">Fuel Surcharge Waiver</td>
                                            <td className="px-4 py-3">✅</td>
                                            <td className="px-4 py-3">✅</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">Reward Redemption</td>
                                            <td className="px-4 py-3">Book IndiGo flights, add-ons</td>
                                            <td className="px-4 py-3">Book IndiGo flights, add-ons</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">💸 How 6E Rewards Work</h2>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                6E Rewards are points you earn through spending, which can be redeemed for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Booking IndiGo flight tickets</li>
                                <li>Seat selection, meals, baggage add-ons</li>
                                <li>Partner platforms like dining and entertainment</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                1 6E Reward = ₹1 in redemption value (on IndiGo services).
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">🛂 Eligibility Criteria</h2>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-8 rounded-lg border border-blue-100 mb-8">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-white">
                                            <th className="px-4 py-3 text-left">Criteria</th>
                                            <th className="px-4 py-3 text-left">6E Rewards</th>
                                            <th className="px-4 py-3 text-left">6E Rewards XL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="px-4 py-3">Age (Salaried)</td>
                                            <td className="px-4 py-3">21–60 years</td>
                                            <td className="px-4 py-3">21–60 years</td>
                                        </tr>
                                        <tr className="border-b bg-gray-50">
                                            <td className="px-4 py-3">Monthly Income</td>
                                            <td className="px-4 py-3">₹50,000+</td>
                                            <td className="px-4 py-3">₹1,00,000+</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-3">Self-Employed Income</td>
                                            <td className="px-4 py-3">₹7.2L+ per year</td>
                                            <td className="px-4 py-3">₹12L+ per year</td>
                                        </tr>
                                        <tr className="border-b bg-gray-50">
                                            <td className="px-4 py-3">Credit Score</td>
                                            <td className="px-4 py-3">720+ (recommended)</td>
                                            <td className="px-4 py-3">750+ (recommended)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">🧳 Who Should Get These Cards?</h2>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Occasional Travelers</h3>
                                    <p className="text-gray-700">If you travel 3–4 times a year, the basic 6E Rewards Card offers good value without high fees.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Frequent Flyers</h3>
                                    <p className="text-gray-700">If you take monthly flights or travel for business, the 6E Rewards XL Card is worth the upgrade for lounge access and accelerated rewards.</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mt-12 mb-6 text-indigo-800">📝 Final Verdict</h2>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                For domestic travel, especially with IndiGo Airlines, these cards are arguably the best in their class.
                            </p>
                            <h3 className="font-semibold text-lg mb-2">✅ Why HDFC-IndiGo Credit Cards Are Worth It:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Great return on IndiGo spends</li>
                                <li>Welcome vouchers cover joining fee</li>
                                <li>Travel-related perks tailored to Indian flyers</li>
                                <li>Seamless redemption process</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
                            <p className="text-gray-700 leading-relaxed">
                                💡 Pro Tip: Pair this card with a fuel rewards card or cashback card for other daily expenses—maximize your savings and build a strong credit score.
                            </p>
                        </div>

                        {/* FAQ Section */}
                        <section aria-label="Frequently Asked Questions" className="mt-12">
                            <h2 className="text-2xl font-bold mb-6 text-indigo-800">Frequently Asked Questions</h2>
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-2">Can I use the 6E Rewards for any airline?</h3>
                                    <p className="text-gray-700">No, 6E Rewards are redeemable only on IndiGo flights and its platform add-ons.</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-2">Is it worth upgrading to the XL version?</h3>
                                    <p className="text-gray-700">Yes, if you travel frequently and can benefit from lounge access and higher reward rates.</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-2">How to apply for the HDFC IndiGo credit card?</h3>
                                    <p className="text-gray-700">You can apply at <Link href="https://www.financialhealth.co.in/credit?category=airlines" className="text-blue-600 hover:underline">https://www.financialhealth.co.in/credit?category=airlines</Link>.</p>
                                </div>
                            </div>
                        </section>
                    </article>
                </main>
            </div>
        </>
    )
}
