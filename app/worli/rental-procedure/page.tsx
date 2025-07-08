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
                Lower Cost
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
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Third Party Paperwork Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Once the Deal is Finalized - Third Party Paperwork
          </h3>
          
          <div className="bg-indigo-50 rounded-lg p-6 mb-8">
            <h4 className="text-xl font-semibold text-blue-900 mb-4">
              We Connect with Third Party to Finish All Paperwork
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">Landlord Pays:</h5>
                <p className="text-gray-700">10% of one month rent</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">Tenant Pays:</h5>
                <p className="text-gray-700">10% of one month rent + Government stamp duty</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-6">
              Documents Needed:
            </h4>
            
            <div className="space-y-6">
              {/* Section 1: Identity Documents */}
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">1. Identity Documents</h5>
                <ul className="space-y-2 text-gray-700">
                  <li>• Aadhar and PAN card for both parties</li>
                  <li>• Passport size photo for both parties</li>
                  <li>• Aadhar card for both witnesses</li>
                </ul>
              </div>

              {/* Section 2: Contact & Occupation */}
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">2. Contact & Occupation</h5>
                <ul className="space-y-2 text-gray-700">
                  <li>• Contact details for both parties</li>
                  <li>• Occupation for both parties</li>
                </ul>
              </div>

              {/* Section 3: Contract Details */}
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">3. Contract Details</h5>
                <ul className="space-y-2 text-gray-700">
                  <li>• Rent amount</li>
                  <li>• Deposit amount</li>
                  <li>• Duration of agreement</li>
                  <li>• Mode of payment of deposit</li>
                  <li>• Lock-in period</li>
                  <li>• Maintenance charges paid by (Landlord/Tenant)</li>
                </ul>
              </div>

              {/* Section 4: Payment Details */}
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">4. Payment Details (Based on Mode)</h5>
                
                <div className="space-y-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h6 className="font-semibold text-gray-900 mb-2">4.1 If Mode of Payment is Cheque/Internet Banking:</h6>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Bank name</li>
                      <li>• Branch name</li>
                      <li>• Transaction ID/cheque number</li>
                      <li>• Date of transaction</li>
                      <li>• Transaction amount</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h6 className="font-semibold text-gray-900 mb-2">4.2 If UPI:</h6>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Transaction ID</li>
                      <li>• Date of transaction</li>
                      <li>• Transaction amount</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h6 className="font-semibold text-gray-900 mb-2">4.3 If Cash:</h6>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Date of transaction</li>
                      <li>• Transaction amount</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 5: Property Details */}
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">5. Property Details</h5>
                <ul className="space-y-2 text-gray-700">
                  <li>• Flat number</li>
                  <li>• Floor number</li>
                  <li>• Building and society name</li>
                  <li>• Built up area (in square feet)</li>
                  <li>• Parking area (in square feet - optional)</li>
                  <li>• Gallery area (in square feet - optional)</li>
                  <li>• Survey number/CTS number</li>
                  <li>• Complete address with pin code</li>
                  <li>• Village name as per property index 2</li>
                </ul>
              </div>

              {/* Section 6: Amenities */}
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">6. Amenities</h5>
                <p className="text-gray-700">List of all amenities available in the property</p>
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
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
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
              
              <div className="bg-indigo-50 rounded-lg p-4 mt-6">
                <p className="text-blue-800 text-sm font-medium">
                  <strong>That's it!</strong> GharConnect handles everything else - document preparation, legal compliance, and all paperwork.
                </p>
              </div>
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
              <h4 className="font-semibold mb-2">Lower Cost</h4>
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
              href="https://wa.me/919321314553?text=Hi, I want to list my property for rent on GharConnect"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiHome className="w-5 h-5 mr-2" />
              List Your Property
            </a>
            <a 
              href="/worli/rent"
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