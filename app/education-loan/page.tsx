'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Header from "@/components/Header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'
import Link from "next/link"
import { auth } from '@/lib/firebase'
import LoanEmiCalculator from "@/components/LoanEmiCalculator"

interface Lender {
  id: number
  name: string
  logo: string
  interestRate: string
  processingFee: string
  loanAmount: string
  tenure: string
  features: string[]
  url?: string
}

const lenders: Lender[] = [
  {
    id: 1,
    name: "GyanDhan",
    logo: "/bank-logos/gyandhan-logo.png",
    interestRate: "8.5% - 9.5% p.a.",
    processingFee: "Up to 0.5%",
    loanAmount: "₹2 Lakhs - ₹50 Lakhs",
    tenure: "1 - 15 years",
    features: ["Quick disbursal", "Minimal documentation", "Flexible EMI options"],
    url: "https://www.gyandhan.com/loaneligs?campaign_partner=Financial+Health"
  },
  // {
  //   id: 2,
  //   name: "ICICI Bank",
  //   logo: "/bank-logos/icici-logo.png",
  //   interestRate: "8.75% - 9.25% p.a.",
  //   processingFee: "Up to 0.5%",
  //   loanAmount: "₹2 Lakhs - ₹50 Lakhs",
  //   tenure: "1 - 15 years",
  //   features: ["Instant approval", "Zero prepayment charges", "Online account management"]
  // },
  {
    id: 3,
    name: "Axis Bank",
    logo: "/bank-logos/axis-logo.png",
    interestRate: "8.49% - 9.25% p.a.",
    processingFee: "Up to 0.5%",
    loanAmount: "₹2 Lakhs - ₹50 Lakhs",
    tenure: "1 - 15 years",
    features: ["Quick processing", "Competitive rates", "Flexible repayment"]
  }
]

function EducationLoan() {
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false)
  const [eligibilityMessage, setEligibilityMessage] = useState<React.ReactNode>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const eligible = searchParams.get('eligible')

  let filteredLenders = lenders
  let showApply = (id: number) => eligible === 'yes'

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    has_college_letter: false,
    acceptTerms: false
  })

  const resetForm = () => {
    setFormData({
      name: '',
      gender: '',
      has_college_letter: false,
      acceptTerms: false
    })
  }

  const checkLogin = () => {
    const user = auth.currentUser;
    if (!user) {
      const currentPath = encodeURIComponent('/education-loan');
      router.push(`/login?redirect=${currentPath}`);
      return false;
    }
    return true;
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (!checkLogin()) return;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.acceptTerms) return;
    
    const user = auth.currentUser;
    if (!user) {
      const currentPath = encodeURIComponent('/education-loan');
      router.push(`/login?redirect=${currentPath}`);
      return;
    }

    try {
      // Save the eligibility check data to the database
      const response = await fetch('/api/education-loan/eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_user_id: user.uid,
          email: user.email,
          name: formData.name,
          gender: formData.gender,
          has_college_letter: formData.has_college_letter
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server error response:', responseData);
        throw new Error(responseData.details || responseData.error || 'Failed to save eligibility check data');
      }

      // Update URL with eligibility parameter
      const params = new URLSearchParams()
      params.set('eligible', 'yes')
      router.push(`/education-loan?${params.toString()}`)
      
      // Close the dialog and reset form
      setIsEligibilityOpen(false)
      resetForm()

      // Scroll to lending partners section
      if (lendersRef.current) {
        lendersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } catch (error) {
      console.error('Error saving eligibility check:', error);
      setEligibilityMessage(
        <div className="text-red-600">
          {error instanceof Error ? error.message : 'Failed to save eligibility check data. Please try again.'}
        </div>
      );
    }
  }

  const handleApply = (lender: Lender) => {
    if (!checkLogin()) return;
    
    if (lender.name === "GyanDhan" && lender.url) {
      window.open(lender.url, '_blank');
    }
  }

  // Prevent background scroll on mobile when dialog is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const lockScroll = () => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
    };
    const unlockScroll = () => {
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
    if (isEligibilityOpen && window.matchMedia('(max-width: 767px)').matches) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [isEligibilityOpen]);

  // Refs for slider navigation
  const lendersRef = useRef<HTMLDivElement>(null)
  const eligibilityRef = useRef<HTMLDivElement>(null)
  const calculatorRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const formCardRef = useRef<HTMLDivElement>(null)

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {/* Blue Hero Section */}
        <section className="w-full bg-blue-700 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Education Loan</h1>
              <p className="text-lg md:text-xl text-white/90 mb-2">
                Check eligibility and we will show you the best education loan offers
              </p>
            </div>
          </div>
        </section>

        {/* Show only Lending Partners with blue box and green message if eligible */}
        {eligible === 'yes' ? (
          <section className="w-full py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="mb-8">
                <h2 className="text-4xl font-extrabold text-center mb-2">
                  <span className="text-purple-700">Lending</span> <span className="text-black">Partners</span>
                </h2>
                <p className="text-center text-green-600 text-xl font-medium">You are eligible to apply with the below lending partner</p>
              </div>
              {/* Desktop: Table style */}
              <div className="hidden md:block">
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 w-full min-w-0 mx-auto">
                  <div className="grid grid-cols-7 gap-0 mb-4 px-3 py-2 bg-gray-50 rounded-lg text-base font-semibold text-gray-700 items-center" style={{ gridTemplateColumns: '2fr 1.2fr 1.2fr 1.5fr 1.2fr 2fr 1fr' }}>
                    <div className="flex items-center">Lender</div>
                    <div className="flex items-center">Interest Rate</div>
                    <div className="flex items-center">Processing Fee</div>
                    <div className="flex items-center">Loan Amount</div>
                    <div className="flex items-center">Tenure</div>
                    <div className="flex items-center">Key Features</div>
                    <div></div>
                  </div>
                  <div className="space-y-0">
                    {filteredLenders.map((lender) => (
                      <div key={lender.id} className="grid grid-cols-7 gap-0 items-center px-3 py-6 border-b last:border-b-0 hover:bg-gray-50 rounded-lg transition-colors" style={{ gridTemplateColumns: '2fr 1.2fr 1.2fr 1.5fr 1.2fr 2fr 1fr' }}>
                        {/* Lender Logo & Name */}
                        <div className="flex items-center gap-3">
                          <img src={lender.logo} alt={lender.name} className="h-8 w-auto" style={{ maxWidth: 48 }} />
                          <span className="font-semibold text-base md:text-lg">{lender.name}</span>
                        </div>
                        <div className="font-semibold">{lender.interestRate}</div>
                        <div className="font-semibold">{lender.processingFee}</div>
                        <div className="font-semibold">{lender.loanAmount}</div>
                        <div className="font-semibold">{lender.tenure}</div>
                        <div>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {lender.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-center">
                          <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto" onClick={() => handleApply(lender)}>Apply Now</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Mobile: Card style */}
              <div className="block md:hidden w-full">
                {filteredLenders.map((lender) => (
                  <div key={lender.id} className="bg-white rounded-xl shadow-lg p-4 mb-4 w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={lender.logo} alt={lender.name} className="h-8 w-auto" style={{ maxWidth: 48 }} />
                      <span className="font-semibold text-lg">{lender.name}</span>
                    </div>
                    <div className="mb-1 flex text-sm">
                      <span className="font-semibold text-gray-700 min-w-[120px]">Interest Rate:</span>
                      <span className="ml-2">{lender.interestRate}</span>
                    </div>
                    <div className="mb-1 flex text-sm">
                      <span className="font-semibold text-gray-700 min-w-[120px]">Processing Fee:</span>
                      <span className="ml-2">{lender.processingFee}</span>
                    </div>
                    <div className="mb-1 flex text-sm">
                      <span className="font-semibold text-gray-700 min-w-[120px]">Loan Amount:</span>
                      <span className="ml-2">{lender.loanAmount}</span>
                    </div>
                    <div className="mb-1 flex text-sm">
                      <span className="font-semibold text-gray-700 min-w-[120px]">Tenure:</span>
                      <span className="ml-2">{lender.tenure}</span>
                    </div>
                    <div className="mt-2">
                      <span className="block font-semibold text-gray-700 mb-1">Key Features:</span>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {lender.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full mt-4" onClick={() => handleApply(lender)}>Apply Now</Button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Sticky Navigation Slider/Tab Bar below hero section */}
            <div ref={sliderRef} className="sticky top-0.5 z-50 w-full bg-white border-b border-gray-200 shadow-sm" style={{ overflow: 'visible' }}>
              <div className="flex w-full rounded-none bg-white">
                <button
                  className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors"
                  onClick={() => handleScroll(formCardRef)}
                >
                  Eligibility Check
                </button>
                <button
                  className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors"
                  onClick={() => handleScroll(calculatorRef)}
                >
                  EMI Calculator
                </button>
                <button
                  className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors"
                  onClick={() => handleScroll(lendersRef)}
                >
                  Lending Partners
                </button>
              </div>
            </div>

            {/* Side-by-side Info + Get Started Form Section */}
            <section className="w-full bg-gradient-to-r from-blue-50 to-green-50 py-10 md:py-16">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-between">
                {/* Left: Title, Subtitle, Description, Offer */}
                <div className="flex-1 max-w-xl">
                  <div className="text-green-700 font-semibold text-lg mb-2">Education Loan</div>
                  <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-3 leading-tight">
                    Finance your education with the best loan offers!
                  </h1>
                  <div className="hidden sm:block">
                    <p className="text-gray-700 text-lg mb-6">
                      Get access to education loans from top banks and financial institutions. We help you find the best rates and terms for your educational journey.
                    </p>
                  </div>
                  {/* Amazon Voucher Offer Card */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm w-fit mb-4">
                    <span className="font-medium text-blue-900">On every successful application, customers will earn <span className="bg-blue-600 text-white px-2 py-1 rounded">Amazon vouchers worth INR 1,500 to 5,000</span>.</span>
                  </div>
                </div>

                {/* Right: Get Started Form */}
                <div ref={formCardRef} className="flex-1 max-w-xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-8 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Get Started</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="col-span-1">
                        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={e => handleInputChange('name', e.target.value)}
                          placeholder="Your Name"
                          required
                        />
                      </div>
                      {/* Gender */}
                      <div className="col-span-1">
                        <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => handleInputChange('gender', value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                            <SelectItem value="O">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Offer Letter */}
                      <div className="col-span-2">
                        <Label>Do you have a college offer letter? <span className="text-red-500">*</span></Label>
                        <div className="flex items-center gap-6 mt-2">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name="has_college_letter" value="yes" checked={formData.has_college_letter === true} onChange={() => handleInputChange('has_college_letter', true)} required className="accent-purple-700" />
                            Yes
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name="has_college_letter" value="no" checked={formData.has_college_letter === false} onChange={() => handleInputChange('has_college_letter', false)} required className="accent-purple-700" />
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="acceptTerms"
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={e => handleInputChange('acceptTerms', e.target.checked)}
                        className="w-4 h-4"
                        required
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                        I accept the <Link href="/terms" className="text-green-700 underline">terms and conditions</Link>
                      </label>
                    </div>
                    <Button type="submit" className="w-full" disabled={!formData.acceptTerms}>Check Eligibility</Button>
                  </form>
                </div>
              </div>
            </section>

            {/* EMI Calculator Section */}
            <section ref={calculatorRef} className="w-full py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Calculate Your EMI</h2>
                <LoanEmiCalculator />
              </div>
            </section>

            {/* Lenders Section */}
            <section ref={lendersRef} className="w-full py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                    <span className="text-purple-700 font-extrabold">Lending</span> Partners
                  </h2>
                  <p className="text-center text-base md:text-lg text-gray-700">We have partnered with lenders to get the best offers for our customers.</p>
                </div>
                {/* Desktop: Table style */}
                <div className="hidden md:block">
                  <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 w-full min-w-0 mx-auto">
                    <div className="grid grid-cols-7 gap-0 mb-4 px-3 py-2 bg-gray-50 rounded-lg text-base font-semibold text-gray-700 items-center" style={{ gridTemplateColumns: '2fr 1.2fr 1.2fr 1.5fr 1.2fr 2fr 1fr' }}>
                      <div className="flex items-center">Lender</div>
                      <div className="flex items-center">Interest Rate</div>
                      <div className="flex items-center">Processing Fee</div>
                      <div className="flex items-center">Loan Amount</div>
                      <div className="flex items-center">Tenure</div>
                      <div className="flex items-center">Key Features</div>
                      <div></div>
                    </div>
                    <div className="space-y-0">
                      {filteredLenders.map((lender) => (
                        <div key={lender.id} className="grid grid-cols-7 gap-0 items-center px-3 py-6 border-b last:border-b-0 hover:bg-gray-50 rounded-lg transition-colors" style={{ gridTemplateColumns: '2fr 1.2fr 1.2fr 1.5fr 1.2fr 2fr 1fr' }}>
                          {/* Lender Logo & Name */}
                          <div className="flex items-center gap-3">
                            <img src={lender.logo} alt={lender.name} className="h-8 w-auto" style={{ maxWidth: 48 }} />
                            <span className="font-semibold text-base md:text-lg">{lender.name}</span>
                          </div>
                          <div className="font-semibold">{lender.interestRate}</div>
                          <div className="font-semibold">{lender.processingFee}</div>
                          <div className="font-semibold">{lender.loanAmount}</div>
                          <div className="font-semibold">{lender.tenure}</div>
                          <div>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                              {lender.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex justify-center">
                            {showApply(lender.id) ? (
                              <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto" onClick={() => handleApply(lender)}>Apply Now</Button>
                            ) : (
                              <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto min-w-[160px]" onClick={() => handleScroll(formCardRef)}>Check Eligibility</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Mobile: Card style */}
                <div className="block md:hidden w-full">
                  {filteredLenders.map((lender) => (
                    <div key={lender.id} className="bg-white rounded-xl shadow-lg p-4 mb-4 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={lender.logo} alt={lender.name} className="h-8 w-auto" style={{ maxWidth: 48 }} />
                        <span className="font-semibold text-lg">{lender.name}</span>
                      </div>
                      <div className="mb-1 flex text-sm">
                        <span className="font-semibold text-gray-700 min-w-[120px]">Interest Rate:</span>
                        <span className="ml-2">{lender.interestRate}</span>
                      </div>
                      <div className="mb-1 flex text-sm">
                        <span className="font-semibold text-gray-700 min-w-[120px]">Processing Fee:</span>
                        <span className="ml-2">{lender.processingFee}</span>
                      </div>
                      <div className="mb-1 flex text-sm">
                        <span className="font-semibold text-gray-700 min-w-[120px]">Loan Amount:</span>
                        <span className="ml-2">{lender.loanAmount}</span>
                      </div>
                      <div className="mb-1 flex text-sm">
                        <span className="font-semibold text-gray-700 min-w-[120px]">Tenure:</span>
                        <span className="ml-2">{lender.tenure}</span>
                      </div>
                      <div className="mt-2">
                        <span className="block font-semibold text-gray-700 mb-1">Key Features:</span>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {lender.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      {showApply(lender.id) ? (
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full mt-4" onClick={() => handleApply(lender)}>Apply Now</Button>
                      ) : (
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full mt-4 min-w-[160px]" onClick={() => handleScroll(formCardRef)}>Check Eligibility</Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default function EducationLoanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EducationLoan />
    </Suspense>
  )
}
