'use client'

import Header from "@/components/Header"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-[160px] bg-gradient-to-r from-blue-600 to-blue-700" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-10">
            <h1 className="text-4xl font-bold text-white mb-3 font-serif tracking-wide">
              About Us
            </h1>
            
            <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8 font-sans">
              
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-lg mt-8">
        <div className="prose prose-lg max-w-none">
          <p className="lead">
            Our mission is simple: to empower individuals like you to make informed, confident decisions about your credit needs.
            In a world where credit card choices can often feel overwhelming, we are here to guide you toward the right financial products—without human biases, and with the help of cutting-edge AI technology.
            We help you understand and improve your credit score, find the perfect credit card that matches your lifestyle, and provide expert assistance in resolving disputes with financial institutions.
          </p>

          <p>
            At Financial Health, we leverage the power of AI to provide you with unbiased, data-driven insights on credit cards and financial products. Our easy-to-use credit score tool provides personalized advisory, helping you understand your current credit standing and offering actionable steps to improve it. This empowers you to confidently apply for financial products that match your credit profile.
          </p>

          <p>
            We understand the challenges of navigating the complex world of credit and financial services. Having experienced firsthand the difficulties in resolving disputes with financial institutions, we recognized the need for expert assistance in this area. Our team of credit experts helps you navigate the complex process of resolving disputes, ensuring your complaints are addressed quickly and satisfactorily.
          </p>

          <p className="font-medium text-lg mt-6">
            Together, we can take the guesswork out of credit management and build a secure, prosperous financial future.
          </p>
        </div>
      </div>
    </div>
  )
} 
