'use client'

import Header from "@/components/Header"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { supabase } from "@/lib/supabase"

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
    if (score < 680) {
      return {
        title: "Improve Your Credit Score",
        message: "Your credit score needs improvement. Consider applying for a secured credit card to build your credit history.",
        buttonText: "View Secured Cards",
        buttonAction: () => router.push('/credit?category=secured'),
        color: "yellow"
      };
    } else if (score >= 680 && score < 720) {
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

export default function CreditReportPage() {
  const router = useRouter()
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

  const [expandedSections, setExpandedSections] = useState({
    activeAccounts: false,
    overdueAccounts: false,
    writtenOffAccounts: false,
    enquiries: false,
    limitUtilization: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchLatestCreditReport = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('No authenticated user found');
          router.push('/login');
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Detailed Credit Report</h1>
            <p className="mt-2 text-sm text-gray-600">
              Last updated: {reportData?.report_created_date || 'Not available'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Report Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Credit Score Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm text-gray-800 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Credit Score
                  </h3>
                  <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                    Last updated: {reportData?.report_created_date || 'Not available'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                    <span className="text-2xl font-bold text-gray-800">{reportData?.credit_score || '--'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {reportData?.credit_score ? 
                        reportData.credit_score >= 750 ? 'Excellent' :
                        reportData.credit_score >= 650 ? 'Good' :
                        reportData.credit_score >= 550 ? 'Fair' : 'Poor' 
                        : 'Score not available'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {reportData?.credit_score ? 
                        `Based on ${reportData.total_accounts} accounts` : 
                        'Upload your report to see your score'}
                    </p>
                  </div>
                  {reportData?.credit_score && <ScoreNotification score={reportData.credit_score} />}
                </div>
              </div>

              {/* Account Summary Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <h3 className="font-medium text-sm text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Account Summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Active Accounts</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {reportData?.active_accounts?.length || '--'}
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Closed Accounts</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {reportData?.closed_accounts || '--'}
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Total Credit Limit</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      ₹{reportData?.credit_limit?.toLocaleString('en-IN') || '--'}
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Current Balance</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      ₹{reportData?.current_balance?.toLocaleString('en-IN') || '--'}
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border-l-4 border-red-400">
                    <p className="text-xs text-gray-500">Written-off Accounts</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {reportData?.written_off_accounts?.length || '--'}
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border-l-4 border-orange-400">
                    <p className="text-xs text-gray-500">Overdue Accounts</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {reportData?.overdue_accounts?.length || '--'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <h3 className="font-medium text-sm text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Activity (Last 6 Months)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Enquiries Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Recent Enquiries</p>
                    {reportData?.enquiries && reportData.enquiries.length > 0 ? (
                      (() => {
                        try {
                          const convertDateFormat = (dateStr: string) => {
                            if (!dateStr) return null;
                            try {
                              // Handle DD-MM-YYYY format
                              if (dateStr.includes('-')) {
                                const [day, month, year] = dateStr.split('-').map(num => num.padStart(2, '0'));
                                const date = new Date(`${year}-${month}-${day}`);
                                if (isNaN(date.getTime())) return null;
                                return date.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                });
                              }
                              
                              // Handle other date formats
                              const date = new Date(dateStr);
                              if (isNaN(date.getTime())) return null;
                              return date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              });
                            } catch (error) {
                              console.error('Error converting date:', error);
                              return null;
                            }
                          };

                          const reportDateStr = reportData?.report_created_date ? convertDateFormat(reportData.report_created_date) : null;
                          if (!reportDateStr) {
                            return <p className="text-sm font-medium text-gray-800 mt-1">--</p>;
                          }
                          
                          const reportDate = new Date(reportDateStr);
                          if (isNaN(reportDate.getTime())) {
                            console.error('Invalid report date:', reportDateStr);
                            return <p className="text-sm font-medium text-gray-800 mt-1">--</p>;
                          }
                          
                          // Filter enquiries from last 6 months
                          const recentEnquiries = reportData.enquiries.filter(enquiry => {
                            try {
                              const enquiryDateStr = convertDateFormat(enquiry.enquiry_date);
                              if (!enquiryDateStr) {
                                console.error('Invalid enquiry date format:', enquiry.enquiry_date);
                                return false;
                              }
                              
                              const enquiryDate = new Date(enquiryDateStr);
                              if (isNaN(enquiryDate.getTime())) {
                                console.error('Invalid enquiry date:', enquiryDateStr);
                                return false;
                              }
                              
                              // Calculate difference in months
                              const diffTime = Math.abs(reportDate.getTime() - enquiryDate.getTime());
                              const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month
                              
                              return diffMonths <= 6;
                            } catch (error) {
                              console.error('Error processing enquiry date:', error);
                              return false;
                            }
                          });

                          return (
                            <p className="text-sm font-medium text-gray-800 mt-1">
                              {recentEnquiries.length} enquiries
                            </p>
                          );
                        } catch (error) {
                          console.error('Error processing dates:', error);
                          return <p className="text-sm font-medium text-gray-800 mt-1">--</p>;
                        }
                      })()
                    ) : (
                      <p className="text-sm font-medium text-gray-800 mt-1">--</p>
                    )}
                  </div>

                  {/* New Accounts Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500">New Accounts</p>
                    {reportData?.active_accounts && reportData.active_accounts.length > 0 ? (
                      (() => {
                        const reportDate = new Date(reportData.report_created_date);
                        const sixMonthsAgo = new Date(reportDate);
                        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                        
                        const newAccounts = reportData.active_accounts.filter(account => {
                          const accountOpenDate = new Date(account.date_opened);
                          return accountOpenDate >= sixMonthsAgo && accountOpenDate <= reportDate;
                        });

                        return (
                          <p className="text-sm font-medium text-gray-800 mt-1">
                            {newAccounts.length} accounts
                          </p>
                        );
                      })()
                    ) : (
                      <p className="text-sm font-medium text-gray-800 mt-1">--</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Detailed Report */}
            <div className="lg:col-span-3 space-y-8">
              {/* Active Accounts Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('activeAccounts')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  <h2 className="text-xl font-semibold text-gray-800">Active Accounts</h2>
                  </div>
                  <svg 
                    className={`w-6 h-6 transform transition-transform duration-300 ${expandedSections.activeAccounts ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedSections.activeAccounts && (
                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lender</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Limit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Opened</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData?.active_accounts?.map((account, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.account_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.lender}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{account.credit_limit.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{account.balance.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.date_opened}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Credit Card Limit Utilization Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('limitUtilization')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Credit Card Limit Utilization</h2>
                  </div>
                  <svg 
                    className={`w-6 h-6 transform transition-transform duration-300 ${expandedSections.limitUtilization ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedSections.limitUtilization && (
                  <div className="mt-6">
                    <div className="space-y-4">
                      {reportData?.active_accounts
                        ?.filter(account => account.account_type.toLowerCase().includes('credit card'))
                        .map((account, index) => {
                          const utilization = account.credit_limit > 0 
                            ? (account.balance / account.credit_limit) * 100 
                            : 0;
                          
                          return (
                            <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                              <div className="flex justify-between items-center mb-3">
                                <div>
                                  <h3 className="font-medium text-gray-900">{account.lender}</h3>
                                  <p className="text-sm text-gray-600">{account.account_type}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">
                                    {utilization.toFixed(1)}% Utilized
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    ₹{account.balance.toLocaleString('en-IN')} / ₹{account.credit_limit.toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full transition-all duration-300 ${
                                    utilization > 80 ? 'bg-red-500' :
                                    utilization > 50 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(utilization, 100)}%` }}
                                ></div>
                              </div>
                              <div className="mt-2 flex justify-between text-xs text-gray-500">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* Overdue Accounts Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('overdueAccounts')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  <h2 className="text-xl font-semibold text-gray-800">Overdue Accounts</h2>
                  </div>
                  <svg 
                    className={`w-6 h-6 transform transition-transform duration-300 ${expandedSections.overdueAccounts ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedSections.overdueAccounts && (
                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lender</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData?.overdue_accounts?.map((account, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.account_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.lender}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{account.overdue_amount.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Written-off Accounts Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('writtenOffAccounts')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  <h2 className="text-xl font-semibold text-gray-800">Written-off Accounts</h2>
                  </div>
                  <svg 
                    className={`w-6 h-6 transform transition-transform duration-300 ${expandedSections.writtenOffAccounts ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedSections.writtenOffAccounts && (
                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lender</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData?.written_off_accounts?.map((account, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.account_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.lender}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{account.amount?.toLocaleString('en-IN') || '--'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Enquiries Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('enquiries')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  <h2 className="text-xl font-semibold text-gray-800">Enquiries</h2>
                  </div>
                  <svg 
                    className={`w-6 h-6 transform transition-transform duration-300 ${expandedSections.enquiries ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedSections.enquiries && (
                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData?.enquiries?.map((enquiry, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.enquiry_date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.enquiry_type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Upload New Report Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => router.push('/credit-score?force_upload=true')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Upload Latest Credit Report</span>
        </button>
      </div>
    </div>
  )
} 