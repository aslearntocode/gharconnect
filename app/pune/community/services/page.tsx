import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PuneServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 lg:pt-16">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Services for Pune are under development
            </p>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded"></div>
          </div>
          
          <div className="max-w-md mx-auto">
            <p className="text-gray-500 text-lg mb-8">
              We're working hard to bring you the best services experience in Pune. 
              Stay tuned for updates!
            </p>
            
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What's Coming?
              </h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                  Society Services
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                  Domestic Help
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                  Driver Services
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                  Community Updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 