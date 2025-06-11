import Header from "@/components/Header"
import { Card } from "@/components/ui/card"

export default function AutoLoanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Auto Loan</h1>
              <p className="text-lg md:text-xl text-white/90 mb-4 text-center">
                Coming Soon
              </p>
            </div>
          </div>
        </section>
        {/* Coming Soon Message */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-white p-8 md:p-12 rounded-xl shadow-lg">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  We're Working on Something Exciting!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We're currently building partnerships with leading banks to bring you the best auto loan options.
                </p>
                <p className="text-base text-gray-500">
                  Stay tuned for updates as we work to help you get the best rates for your next vehicle purchase.
                </p>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
} 