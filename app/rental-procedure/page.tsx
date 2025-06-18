'use client';

import Header from '@/components/Header';
import { FiCheckCircle, FiClock, FiUser, FiFileText, FiShield, FiSmartphone, FiMail, FiHome, FiDollarSign, FiArrowRight } from 'react-icons/fi';

export default function RentalProcedurePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Digital Rental Agreement Process
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-6 max-w-3xl mx-auto">
              Complete your rental agreement online with secure digital signatures and Aadhaar verification
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="bg-white/20 px-4 py-2 rounded-full text-xs font-medium">
                <FiShield className="inline w-4 h-4 mr-1" />
                Secure & Legal
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full text-xs font-medium">
                <FiClock className="inline w-4 h-4 mr-1" />
                Quick Process
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full text-xs font-medium">
                <FiSmartphone className="inline w-4 h-4 mr-1" />
                Mobile Friendly
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Workflow
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process ensures a smooth rental agreement experience with SignDesk integration
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHome className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Property Listing</h3>
            <p className="text-gray-600 text-sm">
              Landlord lists property on GharConnect with basic details
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Tenant Selection</h3>
            <p className="text-gray-600 text-sm">
              Tenant applies and landlord selects the most suitable candidate
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3. GharConnect Prepares Everything</h3>
            <p className="text-gray-600 text-sm">
              We handle all document preparation, legal compliance, and agreement drafting
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Simple Digital Signing</h3>
            <p className="text-gray-600 text-sm">
              Both parties just need to sign digitally with Aadhaar verification
            </p>
          </div>
        </div>

        {/* Detailed Workflow */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How GharConnect Handles Everything - You Just Sign!
          </h3>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  GharConnect Does All The Heavy Lifting
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Our Team Handles:</strong> Property documentation, legal compliance, agreement drafting, terms negotiation, and all paperwork.
                  </p>
                  <p className="text-gray-700">
                    <strong>SignDesk Integration:</strong> We automatically upload the complete agreement to SignDesk with pre-configured signature fields.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  You Receive Digital Invitation
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Simple Process:</strong> You receive a secure digital invitation via email/SMS with a link to sign.
                  </p>
                  <p className="text-gray-700">
                    <strong>Quick Verification:</strong> Complete Aadhaar-based e-KYC verification in just 2 minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Review & Sign - That's It!
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Review:</strong> Read through the complete agreement we've prepared for you.
                  </p>
                  <p className="text-gray-700">
                    <strong>Sign:</strong> Click to sign digitally using your Aadhaar - takes just 30 seconds!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Agreement Complete - You're Done!
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Automatic Completion:</strong> Once both parties sign, the agreement is legally binding.
                  </p>
                  <p className="text-gray-700">
                    <strong>Instant Delivery:</strong> Receive your signed agreement via email immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsibilities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Landlord Responsibilities */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <FiHome className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Landlord - Just 3 Simple Steps</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">1. List Your Property</h4>
                  <p className="text-gray-600 text-sm">Provide basic property details and requirements</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">2. Select Tenant</h4>
                  <p className="text-gray-600 text-sm">Choose the most suitable tenant from applications</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">3. Sign Digitally</h4>
                  <p className="text-gray-600 text-sm">Just sign the agreement we prepare for you</p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 mt-6">
                <p className="text-green-800 text-sm font-medium">
                  <strong>That's it!</strong> GharConnect handles everything else - document preparation, legal compliance, and all paperwork.
                </p>
              </div>
            </div>
          </div>

          {/* Tenant Responsibilities */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Tenant - Just 3 Simple Steps</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">1. Apply for Property</h4>
                  <p className="text-gray-600 text-sm">Submit your application with basic details</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">2. Get Selected</h4>
                  <p className="text-gray-600 text-sm">Wait for landlord's selection</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">3. Sign Digitally</h4>
                  <p className="text-gray-600 text-sm">Just sign the agreement we prepare for you</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <p className="text-blue-800 text-sm font-medium">
                  <strong>That's it!</strong> GharConnect handles everything else - document preparation, legal compliance, and all paperwork.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Handle Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What GharConnect Handles For You
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Document Preparation</h4>
              <p className="text-gray-600 text-sm">Complete rental agreement drafting with all legal terms</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Legal Compliance</h4>
              <p className="text-gray-600 text-sm">Ensure all terms comply with local rental laws</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Terms Negotiation</h4>
              <p className="text-gray-600 text-sm">Help negotiate fair terms between parties</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSmartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Digital Setup</h4>
              <p className="text-gray-600 text-sm">Configure SignDesk integration and signature fields</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
              <p className="text-gray-600 text-sm">Coordinate between landlord and tenant</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Payment Setup</h4>
              <p className="text-gray-600 text-sm">Help arrange security deposit and rent collection</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8 mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">
            Benefits of Digital Rental Agreement
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Time Saving</h4>
              <p className="text-indigo-100 text-sm">Complete process in minutes instead of days</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Legally Valid</h4>
              <p className="text-indigo-100 text-sm">Aadhaar-based signatures are legally binding</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSmartphone className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Mobile Friendly</h4>
              <p className="text-indigo-100 text-sm">Sign documents from anywhere using your phone</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Secure Storage</h4>
              <p className="text-indigo-100 text-sm">Documents stored securely with audit trail</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Cost Effective</h4>
              <p className="text-indigo-100 text-sm">No printing, courier, or physical meeting costs</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Instant Delivery</h4>
              <p className="text-indigo-100 text-sm">Signed documents delivered immediately via email</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Digital Rental Agreement?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of rental agreements with our secure, fast, and legally valid digital signing process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/parel/rent"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiHome className="w-5 h-5 mr-2" />
              List Your Property
            </a>
            <a 
              href="/parel/rent"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiUser className="w-5 h-5 mr-2" />
              Find Rental Property
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 