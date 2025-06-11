'use client'

import Header from "@/components/Header"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { supabase } from "@/lib/supabase"
import { config } from '@/app/config'

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

const ScoreNotification = ({ score }: { score: number }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  type ColorType = 'yellow' | 'blue' | 'green';
  type NotificationContent = {
    title: string;
    message: string;
    buttonText: string;
    buttonAction: () => void;
    color: ColorType;
  };

  const getNotificationContent = (): NotificationContent => {
    if (score < 650) {
      return {
        title: "Improve Your Credit Score",
        message: "Your credit score needs improvement. Consider applying for a secured credit card to build your credit history.",
        buttonText: "View Secured Cards",
        buttonAction: () => router.push('/credit?category=secured'),
        color: "yellow"
      };
    } else if (score >= 650 && score < 750) {
      return {
        title: "Explore UPI Credit Cards",
        message: "Your credit score is good! Check out our selection of UPI-enabled credit cards with great rewards.",
        buttonText: "View UPI Cards",
        buttonAction: () => router.push('/credit?category=upi'),
        color: "blue"
      };
    } else {
      return {
        title: "Premium Card Offers Available!",
        message: "Excellent credit score! You're eligible for our premium credit cards with exclusive benefits.",
        buttonText: "Explore Premium Cards",
        buttonAction: () => router.push('/credit?category=premium'),
        color: "green"
      };
    }
  };

  const content = getNotificationContent();
  const colorClasses: Record<ColorType, {
    bg: string;
    border: string;
    text: string;
    button: string;
    icon: string;
  }> = {
    yellow: {
      bg: "bg-yellow-50/90 backdrop-blur-sm",
      border: "border-yellow-200/50",
      text: "text-yellow-800",
      button: "bg-yellow-100/90 hover:bg-yellow-200/90 text-yellow-800",
      icon: "text-yellow-400"
    },
    blue: {
      bg: "bg-blue-50/90 backdrop-blur-sm",
      border: "border-blue-200/50",
      text: "text-blue-800",
      button: "bg-blue-100/90 hover:bg-blue-200/90 text-blue-800",
      icon: "text-blue-400"
    },
    green: {
      bg: "bg-green-50/90 backdrop-blur-sm",
      border: "border-green-200/50",
      text: "text-green-800",
      button: "bg-green-100/90 hover:bg-green-200/90 text-green-800",
      icon: "text-green-400"
    }
  };

  return (
    <div 
      className={`fixed right-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`relative ${colorClasses[content.color].bg} ${colorClasses[content.color].border} rounded-l-xl shadow-lg p-4 w-[300px] border backdrop-blur-sm transition-all duration-300`}>
        {/* Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`absolute -left-10 top-1/2 transform -translate-y-1/2 w-10 h-10 ${colorClasses[content.color].bg} ${colorClasses[content.color].border} rounded-l-xl flex items-center justify-center shadow-lg z-50 backdrop-blur-sm hover:scale-105 transition-transform duration-200`}
        >
          <svg 
            className={`w-5 h-5 ${colorClasses[content.color].icon} transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className={`p-2 rounded-lg ${colorClasses[content.color].button} bg-opacity-50`}>
              <svg className={`h-5 w-5 ${colorClasses[content.color].icon}`} viewBox="0 0 20 20" fill="currentColor">
                {score < 700 ? (
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                ) : score >= 700 && score < 750 ? (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                )}
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${colorClasses[content.color].text} mb-1`}>{content.title}</h3>
            <div className="text-sm text-gray-600">
              <p>{content.message}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={content.buttonAction}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${colorClasses[content.color].button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${content.color}-500 hover:scale-105 transition-all duration-200`}
              >
                {content.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CreditScorePage() {
  const router = useRouter()
  const [structuredData, setStructuredData] = useState<{
    score: number;
    openAccounts: number;
    closedAccounts: number;
    writtenOffAccounts: any[];
    overdueAccounts: any[];
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    dob: '',
    mobile: '',
    pdfFile: null as File | null,
    pdfPassword: '',
    acceptTerms: false
  })

  const [reportData, setReportData] = useState<{
    report_created_date: string;
    credit_score: number;
    total_accounts: number;
    active_accounts: Array<{
      account_type: string;
      lender: string;
      credit_limit: number;
      balance: number;
      date_opened: string;
    }>;
    credit_limit: number;
    closed_accounts: number;
    current_balance: number;
    overdue_accounts: Array<{
      account_type: string;
      lender: string;
      overdue_amount: number;
    }>;
    written_off_accounts: any[];
    enquiries: Array<{
      enquiry_date: string;
      enquiry_type: string;
    }>;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.displayName) {
        setFormData(prev => ({...prev, name: user.displayName || ''}))
      }
    })

    return () => unsubscribe()
  }, [])

  // Update useEffect to handle authentication state
  useEffect(() => {
    const fetchLatestCreditReport = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('No authenticated user found');
          return;
        }

        const { data, error } = await supabase
          .from('credit_reports_pdf')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('No credit report found for user');
            return;
          }
          console.error('Error fetching credit report:', error);
          return;
        }

        if (data) {
          // Check if force_upload is in the URL
          const searchParams = new URLSearchParams(window.location.search);
          const forceUpload = searchParams.get('force_upload');
          
          // Only redirect if force_upload is not true
          if (!forceUpload) {
            router.push('/credit-score/report');
            return;
          }

          setReportData({
            report_created_date: data.report_created_date,
            credit_score: data.credit_score,
            total_accounts: data.total_accounts,
            active_accounts: data.active_accounts || [],
            credit_limit: data.credit_limit,
            closed_accounts: data.closed_accounts,
            current_balance: data.current_balance,
            overdue_accounts: data.overdue_accounts || [],
            written_off_accounts: data.written_off_accounts || [],
            enquiries: data.enquiries || []
          });
        }
      } catch (error) {
        console.error('Error in fetchLatestCreditReport:', error);
      }
    };

    fetchLatestCreditReport();
  }, [router]);

  const handlePageClick = () => {
    const user = auth.currentUser
    if (!user) {
      const currentPath = encodeURIComponent('/credit/score')
      router.push(`/login?redirect=${currentPath}`)
      return
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit called');
    e.preventDefault()
    
    const form = e.target as HTMLFormElement
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
    
    const user = auth.currentUser
    if (!user) {
      const currentPath = encodeURIComponent('/credit/score')
      router.push(`/login?redirect=${currentPath}`)
      return
    }

    // Check if file is selected from the input element
    const file = fileInput.files?.[0]
    if (!file) {
      alert('Please upload a PDF file')
      return
    }

    try {
      submitButton.disabled = true
      submitButton.textContent = 'Processing...'

      // Create FormData and append file with correct field name
      const pdfFormData = new FormData()
      pdfFormData.append('pdf_file', file)
      if (formData.pdfPassword) {
        pdfFormData.append('password', formData.pdfPassword)
      }

      // Log the FormData contents for debugging
      console.log('FormData contents:', {
        hasFile: pdfFormData.has('pdf_file'),
        fileType: file.type,
        fileSize: file.size,
        hasPassword: pdfFormData.has('password')
      })

      // Upload PDF and get analysis
      try {
        const analysisResponse = await fetch('/api/analyze/pdf', {
          method: 'POST',
          body: pdfFormData
        })

        if (!analysisResponse.ok) {
          const errorText = await analysisResponse.text();
          console.error('PDF Analysis Error:', {
            status: analysisResponse.status,
            statusText: analysisResponse.statusText,
            errorText
          });
          
          let errorMessage = 'Failed to analyze PDF. ';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage += errorData.details || errorData.error || 'Please try again later.';
          } catch (e) {
            errorMessage += 'Please check your internet connection and try again.';
          }
          
          throw new Error(errorMessage);
        }

        const responseData = await analysisResponse.json()

        if (!responseData.success) {
          console.error('PDF Analysis Failed:', responseData);
          throw new Error(responseData.details || responseData.error || 'Failed to analyze PDF')
        }

        // Set the report data from the response
        setReportData(responseData.data)

        // Save to Supabase with better error handling
        // const saveReportToSupabase = async (reportData: any) => {
        //   try {
        //     // Convert date format from DD-MM-YYYY or DD/MM/YYYY to YYYY-MM-DD
        //     const convertDateFormat = (dateStr: string) => {
        //       if (!dateStr) return null;
        //       try {
        //         // Replace both - and / with a standard separator
        //         const normalizedDate = dateStr.replace(/[-\/]/g, '-');
        //         const [day, month, year] = normalizedDate.split('-').map(num => num.padStart(2, '0'));
        //         // Validate date components
        //         const date = new Date(`${year}-${month}-${day}`);
        //         if (isNaN(date.getTime())) {
        //           console.error('Invalid date:', dateStr);
        //           return null;
        //         }
        //         return `${year}-${month}-${day}`;
        //       } catch (error) {
        //         console.error('Error converting date:', dateStr, error);
        //         return null;
        //       }
        //     };
        //
        //     const { data, error } = await supabase
        //       .from('credit_reports_pdf')
        //       .insert({
        //         user_id: auth.currentUser?.uid,
        //         report_analysis: reportData,
        //         mobile: formData.mobile,
        //         name: formData.name,
        //         dob: formData.dob,
        //         created_at: new Date().toISOString(),
        //         report_created_date: convertDateFormat(reportData.report_created_date),
        //         credit_score: reportData.credit_score,
        //         total_accounts: reportData.total_accounts,
        //         active_accounts: reportData.active_accounts,
        //         credit_limit: reportData.credit_limit,
        //         closed_accounts: reportData.closed_accounts,
        //         current_balance: reportData.current_balance,
        //         overdue_accounts: reportData.overdue_accounts,
        //         written_off_accounts: reportData.written_off_accounts,
        //         enquiries: reportData.enquiries
        //       })
        //
        //     if (error) {
        //       console.error('Supabase error details:', error);
        //       throw error;
        //     }
        //     return data;
        //   } catch (error: any) {
        //     console.error('Error saving report:', {
        //       message: error.message,
        //       details: error.details,
        //       hint: error.hint,
        //       code: error.code
        //     });
        //     throw error;
        //   }
        // };

        // const savedData = await saveReportToSupabase(responseData.data);
        // console.log('Successfully saved report:', savedData);

      } catch (fetchError: any) {
        console.error('Fetch Error:', {
          message: fetchError.message,
          stack: fetchError.stack,
          name: fetchError.name
        });
        throw new Error('Failed to connect to the server. Please check your internet connection and try again.');
      }
    } catch (err: any) {
      console.error('Raw error:', err);
      const errorDetails = {
        message: err?.message || 'Unknown error occurred',
        stack: err?.stack || '',
        details: err?.details || {},
        code: err?.code || '',
        name: err?.name || 'Error'
      };
      console.error('Structured error details:', errorDetails);
      
      let userMessage = 'An error occurred while processing your request. ';
      if (err?.message?.includes('network')) {
        userMessage += 'Please check your internet connection.';
      } else if (err?.message?.includes('validation')) {
        userMessage += 'Please check your input details.';
      } else if (err?.message?.includes('Server error')) {
        userMessage += 'The server encountered an error. Please try again later.';
      } else {
        userMessage += err.message || 'Please try again later.';
      }
      
      alert(userMessage);
    } finally {
      submitButton.disabled = false
      submitButton.textContent = 'Submit'
    }
  }

  const handleOTPVerification = async () => {
    try {
      // 1. Verify OTP
      // 2. Save to Supabase
      // 3. Redirect to report page
      
      await supabase.from('credit_reports').insert({
        user_id: auth.currentUser?.uid,
        report_analysis: {},
        audio_url: ''
      });

      router.push('/credit/score/report');
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
        onClick={handlePageClick}
      >
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-[160px] bg-gradient-to-r from-blue-600 to-blue-700" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center pt-10">
              <h1 className="text-4xl font-bold text-white mb-3 font-serif tracking-wide">
                Credit Score (Coming Soon)
              </h1>
              
              <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8 font-sans">
                Check and analyze your credit score to make informed financial decisions
              </p>

              {/* How It Works Section */}
              <div className="bg-white rounded-xl p-6 max-w-4xl mx-auto shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-medium text-sm">
                      1
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-sm text-gray-800">Login and Enter Details</h3>
                      <p className="text-xs text-gray-600 mt-1">Fill in your personal details including name, date of birth, and mobile number</p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-medium text-sm">
                      2
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-sm text-gray-800">Upload Credit Report</h3>
                      <p className="text-xs text-gray-600 mt-1">Upload your credit report PDF file</p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-medium text-sm">
                      3
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-sm text-gray-800">Provide Password</h3>
                      <p className="text-xs text-gray-600 mt-1">Enter password if your PDF is password protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Form Section */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Enter Your Details</h2>
                <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="space-y-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input 
                      type="date"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input 
                      type="tel"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Credit Report (PDF) received from CIBIL or Other Credit Bureaus</label>
                    <input 
                      type="file"
                      name="pdf_file"
                      required
                      accept=".pdf,application/pdf"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          console.log('File selected:', {
                            name: file.name,
                            type: file.type,
                            size: file.size
                          })
                          setFormData(prev => ({...prev, pdfFile: file}))
                        }
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">PDF Password (Optional)</label>
                    <input 
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.pdfPassword || ''}
                      onChange={(e) => setFormData({...formData, pdfPassword: e.target.value})}
                      placeholder="Enter password if PDF is protected"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="flex items-start">
                      <input 
                        type="checkbox"
                        required
                        className="mt-1 mr-2"
                        checked={formData.acceptTerms}
                        onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                      />
                      <span className="text-xs text-gray-600">
                        By clicking submit below, 
                        you allow FHAI Services Pvt Ltd to process your credit report and provide you the summary {' '}
                        <a 
                          href="/terms-and-conditions" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          T&C apply
                        </a>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium"
                  >
                    Submit
                  </button>
                </form>

                {/* How to get credit report section */}
                <div className="mt-6 text-center">
                  <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>How to get your credit report?</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 h-full">
                <div className="relative h-full">
                  <div className="bg-white rounded-xl shadow-lg p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src="/Report-Summary.png"
                        alt="Credit Score Analysis"
                        width={400}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-medium text-sm text-gray-900">Score Analysis</span>
                        </div>
                        <span className="text-xs text-gray-500">2-3 minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <span className="font-medium text-sm text-gray-900">Recommendations</span>
                        </div>
                        <span className="text-xs text-gray-500">1-2 minutes</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#4F46E5]/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-[#4F46E5]/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Get Your Credit Report</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                You can get your credit report from any of these sources:
              </p>
              
              <div className="space-y-3">
                <a 
                  href="https://www.cibil.com/freecibilscore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">CIBIL (We support only CIBIL for now)</p>
                    <p className="text-xs text-gray-500">Get your free credit score from CIBIL</p>
                  </div>
                </a>

                <a 
                  href="https://www.experian.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Experian (Coming soon)</p>
                    <p className="text-xs text-gray-500">Get your credit report from Experian</p>
                  </div>
                </a>

                <a 
                  href="https://www.crifhighmark.com/"  
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">CRIF High Mark (Coming soon)</p>
                    <p className="text-xs text-gray-500">Get your credit report from CRIF High Mark</p>
                  </div>
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  After getting your report, you can upload it here to get a detailed analysis and personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 