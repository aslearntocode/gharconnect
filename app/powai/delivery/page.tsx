import Header from '@/components/Header';
import { FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { deliveryCategories } from '@/app/powai/data/delivery';

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Delivery</h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for a delivery service..."
              className="flex-1 outline-none bg-transparent text-gray-700 text-base"
              disabled
            />
          </div>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryCategories.map((category) => (
              <Link
                key={category.id}
                href={`/delivery/${category.slug}`}
                className="block group"
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                  <div className="text-4xl flex-shrink-0">{category.icon}</div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">
                      {category.name}
                    </h2>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 