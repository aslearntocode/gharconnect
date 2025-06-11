'use client'

import Header from "@/components/Header"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { supabase } from "@/lib/supabase"

const CreditScoreMeter = ({ score }: { score: number }) => {
  // Calculate needle rotation (0 to 180 degrees)
  const rotation = Math.min(Math.max((score / 900) * 180, 0), 180);

  return (
    <div className="relative w-full max-w-[400px] mx-auto mt-8">
      {/* Semi-circular meter background */}
      <div className="relative h-[200px] overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bottom-0 rounded-[50%] bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"></div>
        
        {/* Score ranges */}
        <div className="absolute bottom-0 w-full h-[200px]">
          <div className="relative w-full h-full">
            <span className="absolute left-[5%] bottom-8 text-sm font-semibold">Very Low</span>
            <span className="absolute left-[25%] bottom-8 text-sm font-semibold">Low</span>
            <span className="absolute left-[45%] bottom-8 text-sm font-semibold">Average</span>
            <span className="absolute left-[65%] bottom-8 text-sm font-semibold">Above Avg</span>
            <span className="absolute right-[5%] bottom-8 text-sm font-semibold">Excellent</span>
          </div>
        </div>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-[160px] bg-black origin-bottom transform -translate-x-1/2"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute -top-2 left-1/2 w-4 h-4 bg-black rounded-full -translate-x-1/2"></div>
        </div>

        {/* Center point */}
        <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-white border-4 border-black rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Score display */}
      <div className="text-center mt-8">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xl text-gray-600">/900</span>
      </div>
    </div>
  );
};

export default function CreditScorePage() {
  const router = useRouter()
  // Add state for structured data
  const [structuredData, setStructuredData] = useState<{
    score: number;
    openAccounts: number;
    closedAccounts: number;
    writtenOffAccounts: any[];
    overdueAccounts: any[];
  } | null>(null);

  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    dob: '',
    pan: '',
    mobile: '',
    acceptTerms: false
  })

  // Add refs for scroll sections
  const aboutRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const howToApplyRef = useRef<HTMLDivElement>(null)
  const checkScoreRef = useRef<HTMLDivElement>(null)

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.displayName) {
        setFormData(prev => ({...prev, name: user.displayName || ''}))
      }
    })

    return () => unsubscribe()
  }, [])

  const handlePageClick = () => {
    // Remove login redirect from general page click
  }

  const handleInputFocus = () => {
    const user = auth.currentUser
    if (!user) {
      const currentPath = encodeURIComponent('/credit/score')
      router.push(`/login?redirect=${currentPath}`)
      return
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const form = e.target as HTMLFormElement
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
    
    const user = auth.currentUser
    if (!user) {
      const currentPath = encodeURIComponent('/credit/score')
      router.push(`/login?redirect=${currentPath}`)
      return
    }

    try {
      submitButton.disabled = true
      submitButton.textContent = 'Processing...'

      // Format the date for API
      const formattedDate = new Date(formData.dob).toISOString().split('T')[0]

      // Create query parameters
      const params = new URLSearchParams({
        pan: formData.pan.toUpperCase(),
        name: formData.name,
        dob: formattedDate,
        mobile: formData.mobile
      })

      // Use the API route instead of direct server call
      const analysisResponse = await fetch(`/api/credit-report-main?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json()
        throw new Error(errorData.error || `API request failed: ${analysisResponse.statusText}`)
      }

      const analysisData = await analysisResponse.json()

      // Store the analysis data in localStorage for immediate access
      localStorage.setItem('latestCreditReport', JSON.stringify(analysisData))

      // Redirect to report page
      router.push('/credit-score-main/score/report')

    } catch (err: any) {
      // Log the raw error first
      console.error('Raw error:', err);

      // Create a safe error object with fallbacks
      const errorDetails = {
        message: err?.message || 'Unknown error occurred',
        stack: err?.stack || '',
        details: err?.details || {},
        code: err?.code || '',
        name: err?.name || 'Error'
      };

      console.error('Structured error details:', errorDetails);
      
      // Show a more specific error message to the user
      let userMessage = 'An error occurred while processing your request. ';
      if (err?.message?.includes('network')) {
        userMessage += 'Please check your internet connection.';
      } else if (err?.message?.includes('validation')) {
        userMessage += 'Please check your input details.';
      } else {
        userMessage += 'Please try again later.';
      }
      
      alert(userMessage);
    } finally {
      submitButton.disabled = false
      submitButton.textContent = 'Send OTP'
    }
  }

  const generateReport = async () => {
    // TODO: Implement report generation
    return {};
  };

  const handleOTPVerification = async () => {
    try {
      // 1. Verify OTP
      // 2. Generate report
      // 3. Wait for audio generation
      // 4. Save everything to Supabase
      // 5. Only then redirect to report page
      
      const reportData = await generateReport();
      
      await supabase.from('credit_reports').insert({
        user_id: auth.currentUser?.uid,
        report_analysis: reportData,
      });

      router.push('/credit-score-main/score/report');
    } catch (error) {
      console.error('Error during OTP verification:', error);
      alert('An error occurred during OTP verification. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div 
        className="flex-1 bg-gray-50"
      >
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-[160px] bg-gradient-to-r from-blue-600 to-blue-700" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center pt-10">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 font-serif tracking-wide">
                Credit Score (Coming Soon)
              </h1>
              
              <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8 font-sans">
                Check and analyze your credit score to make informed financial decisions
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Navigation Slider */}
        <div className="sticky top-0.5 z-50 w-full bg-white border-b border-gray-200 shadow-sm hidden md:flex">
          <div className="flex w-full rounded-none bg-white">
            <button
              className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors"
              onClick={() => handleScroll(aboutRef)}
            >
              About
            </button>
            <button
              className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors"
              onClick={() => handleScroll(featuresRef)}
            >
              Features
            </button>
            <button
              className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors"
              onClick={() => handleScroll(howToApplyRef)}
            >
              How to Apply
            </button>
            <button
              className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors"
              onClick={() => handleScroll(checkScoreRef)}
            >
              Check Your Score
            </button>
          </div>
        </div>

        {/* About Section */}
        <div ref={aboutRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ scrollMarginTop: '64px' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">About Credit Score</h2>
          <div className="mx-auto mb-10 flex justify-center">
            <div className="h-1 w-20 bg-yellow-400 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 mb-2 text-center">
            Your credit score is a three-digit number that represents your creditworthiness. It helps lenders determine how likely you are to repay your debts on time.
          </p>
          <p className="text-lg text-gray-600 text-center">
            A good credit score can help you get better interest rates on loans and credit cards, while a poor score can make it difficult to get approved for credit.
          </p>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="bg-gray-50 py-12" style={{ scrollMarginTop: '64px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Features & Benefits</h2>
            <div className="mx-auto mb-10 flex justify-center">
              <div className="h-1 w-24 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left features */}
              <div className="space-y-7">
                <div className="flex items-start gap-3">
                  <span className="text-2xl md:text-3xl">📱</span>
                  <div>
                    <div className="font-bold text-base md:text-base">Your Credit Health Matters</div>
                    <div className="text-gray-700 text-sm md:text-sm">Credit Health is one of the most important factors for getting a loan</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl md:text-3xl">💰</span>
                  <div>
                    <div className="font-bold text-base md:text-base">Get Better Loan rates</div>
                    <div className="text-gray-700 text-sm md:text-sm">A good credit score will help you get better interest rates and credit limits</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl md:text-3xl">📈</span>
                  <div>
                    <div className="font-bold text-base md:text-base">Monitor your credit health</div>
                    <div className="text-gray-700 text-sm md:text-sm">Check your credit score and report regularly to track your credit health</div>
                  </div>
                </div>
              </div>
              {/* Center image */}
              <div className="flex justify-center items-center">
                <Image
                  src="/Credit-Score-Analysis.png"
                  alt="Credit Score Mobile Illustration"
                  width={380}
                  height={460}
                  className="mx-auto drop-shadow-xl rounded-2xl bg-white"
                  priority
                />
              </div>
              {/* Right features */}
              <div className="space-y-7">
                <div className="flex items-start gap-3">
                  <span className="text-2xl md:text-3xl">🔍</span>
                  <div>
                    <div className="font-bold text-base md:text-base">Learn about key insights</div>
                    <div className="text-gray-700 text-sm md:text-sm">Learn about your credit history, credit health and various other factors</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl md:text-3xl">🤝</span>
                  <div>
                    <div className="font-bold text-base md:text-base">Improve your financial decisions</div>
                    <div className="text-gray-700 text-sm md:text-sm">Make better decisions to grow your savings and improve your finances</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl md:text-3xl">🛡️</span>
                  <div>
                    <div className="font-bold text-base md:text-base">Correct any discrepancies</div>
                    <div className="text-gray-700 text-sm md:text-sm">Contact the lender or the concerned credit bureau to correct any discrepancies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Apply Section */}
        <div ref={howToApplyRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ scrollMarginTop: '64px' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">How To Apply</h2>
          <div className="mx-auto mb-10 flex justify-center">
            <div className="h-1 w-20 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="flex md:grid md:grid-cols-4 gap-6 md:gap-8 text-center overflow-x-auto md:overflow-visible pb-2 md:pb-0 snap-x snap-mandatory">
            {/* Step 1 */}
            <div className="min-w-[260px] max-w-xs flex-shrink-0 md:min-w-0 md:max-w-none bg-white border shadow rounded-xl p-4 snap-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-lg w-24 h-24 flex items-center justify-center">
                  {/* User Icon */}
                  <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-900">
                    <rect x="4" y="2" width="16" height="20" rx="4" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
              </div>
              <div className="font-bold text-lg mb-1">Step 1</div>
              <div className="text-gray-700 text-base">Enter your mobile number linked with your PAN Card.</div>
            </div>
            {/* Step 2 */}
            <div className="min-w-[260px] max-w-xs flex-shrink-0 md:min-w-0 md:max-w-none bg-white border shadow rounded-xl p-4 snap-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-lg w-24 h-24 flex items-center justify-center">
                  {/* Lock Icon */}
                  <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-900">
                    <rect x="4" y="2" width="16" height="20" rx="4" strokeWidth="2"/>
                    <rect x="8" y="14" width="8" height="4" rx="2" fill="none" />
                    <rect x="9" y="10" width="6" height="4" rx="2" fill="none" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 16v-2" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="font-bold text-lg mb-1">Step 2</div>
              <div className="text-gray-700 text-base">Verify with an OTP and fill in the required identification details.</div>
            </div>
            {/* Step 3 */}
            <div className="min-w-[260px] max-w-xs flex-shrink-0 md:min-w-0 md:max-w-none bg-white border shadow rounded-xl p-4 snap-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-lg w-24 h-24 flex items-center justify-center">
                  {/* Rupee Icon */}
                  <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-900">
                    <rect x="4" y="2" width="16" height="20" rx="4" strokeWidth="2"/>
                    <text x="12" y="24" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">₹</text>
                  </svg>
                </div>
              </div>
              <div className="font-bold text-lg mb-1">Step 3</div>
              <div className="text-gray-700 text-base">Pay a nominal fee through a convenient payment method.</div>
            </div>
            {/* Step 4 */}
            <div className="min-w-[260px] max-w-xs flex-shrink-0 md:min-w-0 md:max-w-none bg-white border shadow rounded-xl p-4 snap-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-lg w-24 h-24 flex items-center justify-center">
                  {/* PDF Icon */}
                  <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-900">
                    <rect x="4" y="2" width="16" height="20" rx="4" strokeWidth="2"/>
                    <text x="12" y="28" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">PDF</text>
                  </svg>
                </div>
              </div>
              <div className="font-bold text-lg mb-1">Step 4</div>
              <div className="text-gray-700 text-base">Your new credit report will be generated in just a few minutes.</div>
            </div>
          </div>
        </div>

        {/* Check Your Score Section */}
        <div ref={checkScoreRef} className="bg-blue-50 py-12" style={{ scrollMarginTop: '64px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Check Your Score</h2>
            <div className="mx-auto mb-10 flex justify-center">
              <div className="h-1 w-20 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      onFocus={handleInputFocus}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData(prev => ({...prev, dob: e.target.value}))}
                      onFocus={handleInputFocus}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input
                      type="text"
                      value={formData.pan}
                      onChange={(e) => setFormData(prev => ({...prev, pan: e.target.value}))}
                      onFocus={handleInputFocus}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData(prev => ({...prev, mobile: e.target.value}))}
                      onFocus={handleInputFocus}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData(prev => ({...prev, acceptTerms: e.target.checked}))}
                    onFocus={handleInputFocus}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I agree to the terms and conditions
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg opacity-50 cursor-not-allowed"
                  disabled
                >
                  Check Score
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 