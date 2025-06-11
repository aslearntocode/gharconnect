'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

const loanTypes = [
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'home_loan', label: 'Home Loan' },
  { value: 'car_loan', label: 'Car Loan' },
  { value: 'other', label: 'Other' },
];

// Helper to parse assessment into named sections
function parseAssessmentSections(assessment: string) {
  // Split by numbered headings (e.g., 1. Recommendation:, 2. Key Points:, etc.)
  const sectionRegex = /\n?\s*(\d+\.\s[^:]+:)/g;
  const parts = assessment.split(sectionRegex).filter(Boolean);
  // parts: [before, heading1, content1, heading2, content2, ...]
  const sections: Record<string, string> = {};
  let i = 0;
  // Skip intro (parts[0]) if not a heading
  if (parts.length && !/^\d+\./.test(parts[0])) {
    i = 1;
  }
  for (; i < parts.length - 1; i += 2) {
    const heading = parts[i].replace(/\n/g, '').trim();
    sections[heading] = parts[i + 1].trim();
  }
  return sections;
}

function CreditVsLoanAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    reason: '',
    loan_type: 'personal_loan',
    income: '',
    current_emi: '',
    existing_cards: '',
    credit_card_outstanding: '',
    ever_defaulted: 'no',
    credit_score: '',
    mortgage: 'no',
  });
  const [assessment, setAssessment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Section refs for slider navigation
  const aboutRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fetch latest assessment on component mount
  useEffect(() => {
    const fetchLatestAssessment = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('credit_assessments')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('No previous assessment found');
            return;
          }
          console.error('Error fetching assessment:', error);
          return;
        }

        if (data) {
          // Set the assessment response
          if (typeof data.assessment_response === 'string') {
            setAssessment(data.assessment_response);
          } else if (data.assessment_response?.assessment) {
            setAssessment(data.assessment_response.assessment);
          } else {
            setAssessment(JSON.stringify(data.assessment_response));
          }

          // Pre-fill form with previous data
          setForm({
            reason: data.reason || '',
            loan_type: data.loan_type || 'personal_loan',
            income: data.income?.toString() || '',
            current_emi: data.current_emi?.toString() || '',
            existing_cards: data.existing_cards?.toString() || '',
            credit_card_outstanding: data.credit_card_outstanding?.toString() || '',
            ever_defaulted: data.ever_defaulted || 'no',
            credit_score: data.credit_score?.toString() || '',
            mortgage: data.mortgage || 'no',
          });
        }
      } catch (error) {
        console.error('Error in fetchLatestAssessment:', error);
      }
    };

    fetchLatestAssessment();
  }, []);

  const handlePageClick = () => {
    const user = auth.currentUser;
    if (!user) {
      const currentPath = encodeURIComponent('/credit-vs-loan-assessment');
      router.push(`/login?redirect=${currentPath}`);
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const user = auth.currentUser;
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      console.log('Starting assessment submission for user:', user.uid);

      // First get the assessment from the API
      const response = await fetch('/api/analyze/credit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          income: form.income,
          current_emi: form.current_emi,
          credit_card_outstanding: form.credit_card_outstanding,
          credit_Score: form.credit_score,
        }),
      });

      const contentType = response.headers.get('content-type');
      let assessmentData;
      if (contentType && contentType.includes('application/json')) {
        assessmentData = await response.json();
        if (typeof assessmentData === 'string') {
          setAssessment(assessmentData);
        } else if (assessmentData.assessment) {
          setAssessment(assessmentData.assessment);
        } else {
          setAssessment(JSON.stringify(assessmentData));
        }
      } else {
        const text = await response.text();
        setAssessment(text);
        assessmentData = text;
      }

      console.log('Assessment data received:', assessmentData);

      // Prepare data for Supabase with proper type conversion
      const supabaseData = {
        user_id: user.uid,
        reason: form.reason,
        loan_type: form.loan_type,
        income: form.income ? parseFloat(form.income) : null,
        current_emi: form.current_emi ? parseFloat(form.current_emi) : null,
        existing_cards: form.existing_cards ? parseInt(form.existing_cards) : null,
        credit_card_outstanding: form.credit_card_outstanding ? parseFloat(form.credit_card_outstanding) : null,
        ever_defaulted: form.ever_defaulted,
        credit_score: form.credit_score ? parseInt(form.credit_score) : null,
        mortgage: form.mortgage,
        assessment_response: assessmentData
      };

      console.log('Prepared Supabase data:', supabaseData);

      // Save to Supabase with better error handling
      const { data: insertData, error: supabaseError } = await supabase
        .from('credit_assessments')
        .insert(supabaseData)
        .select()
        .single();

      if (supabaseError) {
        console.error('Error saving to Supabase:', {
          error: supabaseError,
          errorCode: supabaseError.code,
          errorMessage: supabaseError.message,
          errorDetails: supabaseError.details,
          data: supabaseData
        });
        throw new Error(`Failed to save assessment: ${supabaseError.message}`);
      }

      console.log('Successfully saved assessment:', insertData);

    } catch (err) {
      console.error('Full error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Section styles by logical name
  const sectionStyles: Record<string, { bg: string; border: string; icon: string }> = {
    'Recommendation:': {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: '📋',
    },
    'Key Points:': {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: '💡',
    },
    'Conditions/Suggestions:': {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: '📝',
    },
    'Summary of Values:': {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: '📊',
    },
  };

  // Helper function to parse assessment text
  const parseAssessmentText = (assessmentText: string | any) => {
    if (!assessmentText) return ['No recommendation available.', 'No condition available.', 'No summary available.'];
    
    // If it's an object, try to get the assessment property
    if (typeof assessmentText === 'object') {
      if (assessmentText.assessment) {
        assessmentText = assessmentText.assessment;
      } else {
        assessmentText = JSON.stringify(assessmentText);
      }
    }

    // Ensure we have a string
    let text = String(assessmentText);
    
    // Replace DTI with full form
    text = text.replace(/DTI/g, 'Debt to Income Ratio (DTI)');
    
    // Remove numbers from section headings and asterisks
    text = text.replace(/^\d+\.\s*/gm, '');
    text = text.replace(/\*+/g, '');
    
    // Split by double newlines or fallback to single newlines
    const paras = text.split(/\n\s*\n/).filter(Boolean);
    // If only one para, try splitting by single newline
    const paragraphs = paras.length >= 3 ? paras : text.split(/\n/).filter(Boolean);

    // Helper to remove sub-headings (bolded or ending with colon) from a section
    const removeSubHeading = (section: string) => {
      const lines = section.split(/\n/).filter(Boolean);
      if (lines.length > 1 && (/^\s*\*\*.*\*\*\s*:?.*$/i.test(lines[0]) || /:$/i.test(lines[0]))) {
        return lines.slice(1).join(' ').trim();
      }
      return section.trim();
    };
    
    // Format conditions and summary as bullet points
    const formatAsBulletPoints = (text: string) => {
      // Split by sentences or newlines
      const points = text.split(/[.!?]\s+|\n/).filter(Boolean);
      return points.map(point => `• ${point.trim()}`).join('\n');
    };
    
    return [
      removeSubHeading(paragraphs[0] || 'No recommendation available.'),
      formatAsBulletPoints(removeSubHeading(paragraphs[1] || 'No condition available.')),
      formatAsBulletPoints(removeSubHeading(paragraphs[2] || 'No summary available.'))
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-[160px] bg-gradient-to-r from-blue-600 to-blue-700" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-2 md:pt-10">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 font-serif tracking-wide text-center !mx-auto">
              Credit Assessment
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8 font-sans text-center">
              Get a quick, AI-powered assessment of your credit profile and loan eligibility.
            </p>
          </div>
        </div>
      </div>
      {/* Move the slider just below the blue box and stretch full width */}
      <div className="sticky top-0.5 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="flex w-full rounded-none bg-white">
          <button className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors" onClick={() => handleScroll(formRef)}>Assessment Form</button>
          <button className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors" onClick={() => handleScroll(resultsRef)}>Assessment Results</button>
          <button className="flex-1 py-3 text-blue-700 text-base md:text-lg font-medium hover:bg-blue-50 focus:bg-blue-100 transition-colors" onClick={() => handleScroll(helpRef)}>Need Help</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assessment Form Section */}
        <div ref={formRef} className="py-12" style={{ scrollMarginTop: '64px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Heading, description, and optional image/highlight */}
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center md:text-left">Credit Assessment</h2>
              <div className="h-1 w-20 bg-yellow-400 rounded-full mb-8 mx-auto md:mx-0"></div>
              <p className="text-lg text-gray-700 mb-6">
                Get a quick, AI-powered assessment of your credit profile and loan eligibility. Fill out the form to receive personalized recommendations and understand your financial standing before applying for a loan or credit card.
              </p>
              {/* Optional: Add an image or highlight box here if desired */}
            </div>
            {/* Right: Form card */}
            <div>
              <Card className="p-6 shadow-2xl rounded-3xl border-0 bg-white/90">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4" onClick={(e) => {
                  e.stopPropagation();
                  const user = auth.currentUser;
                  if (!user) {
                    const currentPath = encodeURIComponent('/credit-vs-loan-assessment');
                    router.push(`/login?redirect=${currentPath}`);
                    return;
                  }
                }}>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for applying (max 100 words)?</label>
                    <textarea
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white"
                      placeholder="e.g. need a loan to travel"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Looking for what kind of loan?</label>
                    <select
                      name="loan_type"
                      value={form.loan_type}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white"
                    >
                      {loanTypes.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">What is your Credit Score (CIBIL)?</label>
                    <input
                      type="number"
                      name="credit_score"
                      value={form.credit_score}
                      onChange={handleChange}
                      min={0}
                      max={900}
                      required
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white"
                      placeholder="e.g. 750"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹):</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="income"
                      value={form.income}
                      onChange={handleChange}
                      required
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="e.g. 150000"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Loan EMI including Mortgage (₹):</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="current_emi"
                      value={form.current_emi}
                      onChange={handleChange}
                      required
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="e.g. 25000"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Do you have an existing mortgage?</label>
                    <select
                      name="mortgage"
                      value={form.mortgage}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of existing credit cards:</label>
                    <input
                      type="number"
                      name="existing_cards"
                      value={form.existing_cards}
                      onChange={handleChange}
                      required
                      min={0}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white"
                      placeholder="e.g. 2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credit Card Outstanding (₹):</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="credit_card_outstanding"
                      value={form.credit_card_outstanding}
                      onChange={handleChange}
                      required
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="e.g. 25000"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ever Defaulted on a Loan?</label>
                    <select
                      name="ever_defaulted"
                      value={form.ever_defaulted}
                      onChange={handleChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm bg-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  {error && (
                    <div className="col-span-1 md:col-span-2 p-2 rounded-lg bg-red-50 text-red-700 text-sm text-center">{error}</div>
                  )}
                  <div className="col-span-1 md:col-span-2">
                    <Button
                      type="submit"
                      className="w-full py-2 text-base rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                      disabled={loading}
                    >
                      {loading ? 'Assessing...' : 'Get Assessment'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>

        {/* Assessment Results Section */}
        <div ref={resultsRef} className="py-12" style={{ scrollMarginTop: '64px' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Assessment Results</h2>
          <div className="mx-auto mb-10 flex justify-center">
            <div className="h-1 w-20 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="max-w-7xl mx-auto">
            <Card className="p-4 md:p-8 shadow-2xl rounded-3xl border-0 bg-white/90">
              {assessment ? (() => {
                const [rec, cond, summ] = parseAssessmentText(assessment);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Recommendation */}
                    <div className="flex flex-col items-start text-left bg-white rounded-2xl border border-purple-200 shadow-md p-6 min-h-[260px] justify-center">
                      <h3 className="text-base font-bold mb-2">Recommendation</h3>
                      <ul className="text-gray-700 text-sm flex-1 list-disc pl-5 space-y-2">
                        {rec.split(/(?<=[.!?])\s+(?=[A-Z])/).map((sentence, index) => (
                          <li key={index}>{sentence.trim()}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Conditions */}
                    <div className="flex flex-col items-start text-left bg-white rounded-2xl border border-green-200 shadow-md p-6 min-h-[260px] justify-center">
                      <h3 className="text-base font-bold mb-2">Conditions</h3>
                      <ul className="text-gray-700 text-sm flex-1 list-disc pl-5 space-y-2">
                        {cond.split('\n').map((point, index) => (
                          <li key={index}>{point.replace('•', '').trim()}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Summary */}
                    <div className="flex flex-col items-start text-left bg-white rounded-2xl border border-blue-200 shadow-md p-6 min-h-[260px] justify-center">
                      <h3 className="text-base font-bold mb-2">Summary</h3>
                      <ul className="text-gray-700 text-sm flex-1 list-disc pl-5 space-y-2">
                        {summ.split('\n').map((point, index) => (
                          <li key={index}>{point.replace('•', '').trim()}</li>
                        ))}
                        <li>
                          {form.loan_type === 'credit_card' ? (
                            <a href="/credit" className="text-blue-700 underline font-semibold">View and apply for Credit Cards</a>
                          ) : form.loan_type === 'personal_loan' ? (
                            <a href="/personal-loans" className="text-blue-700 underline font-semibold">View and apply for Personal Loans</a>
                          ) : form.loan_type === 'home_loan' ? (
                            <a href="/home-loans-refinance" className="text-blue-700 underline font-semibold">View and apply for Home Loans</a>
                          ) : form.loan_type === 'car_loan' ? (
                            <a href="/auto-loan" className="text-blue-700 underline font-semibold">View and apply for Car Loans</a>
                          ) : (
                            <a href="/loans" className="text-blue-700 underline font-semibold">View and apply for Loans</a>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })() : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Recommendation */}
                  <div className="flex flex-col items-start text-left bg-white rounded-2xl border border-purple-200 shadow-md p-6 min-h-[260px] justify-center">
                    <h3 className="text-base font-bold mb-2">Recommendation</h3>
                    <p className="text-gray-500 text-sm">Fill and Submit the form to see your recommendation</p>
                  </div>
                  {/* Conditions */}
                  <div className="flex flex-col items-start text-left bg-white rounded-2xl border border-green-200 shadow-md p-6 min-h-[260px] justify-center">
                    <h3 className="text-base font-bold mb-2">Conditions</h3>
                    <p className="text-gray-500 text-sm">Fill and Submit the form to see your conditions</p>
                  </div>
                  {/* Summary */}
                  <div className="flex flex-col items-start text-left bg-white rounded-2xl border border-blue-200 shadow-md p-6 min-h-[260px] justify-center">
                    <h3 className="text-base font-bold mb-2">Summary</h3>
                    <p className="text-gray-500 text-sm">Fill and Submit the form to see your summary</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Need Help Section */}
        <div ref={helpRef} className="py-12" style={{ scrollMarginTop: '64px' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Need Help?</h2>
          <div className="mx-auto mb-10 flex justify-center">
            <div className="h-1 w-20 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-center lg:gap-4 max-w-2xl mx-auto">
            <a href="https://wa.me/919321314553" target="_blank" rel="noopener noreferrer" className="w-full flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-colors text-base min-w-[180px] text-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Chat with Us
            </a>
            <button className="w-full flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow text-base min-w-[180px] text-center cursor-default">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call Us: +91 93213 14553
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreditVsLoanAssessment() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreditVsLoanAssessmentContent />
    </Suspense>
  );
} 