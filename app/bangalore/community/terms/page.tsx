'use client'

import Header from "@/components/Header"
import TermsContent from "@/components/TermsContent"

export default function BangaloreTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      
      {/* Indigo Banner */}
      <section className="w-full bg-indigo-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-lg md:text-xl text-indigo-100">
            Important information about using GharConnect platform and your responsibilities
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <TermsContent />
        </div>
      </main>
    </div>
  );
} 