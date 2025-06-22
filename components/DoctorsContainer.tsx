import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

export default function DoctorsContainer() {
  const pathname = usePathname();
  
  // Extract society from pathname
  const getSocietyFromPath = () => {
    const pathParts = pathname.split('/');
    // Assuming URL structure is /society-name/...
    return pathParts[1] || 'parel'; // Default to parel if no society in path
  }

  const currentSociety = getSocietyFromPath();

  return (
    <div className="bg-indigo-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Find Local Doctors</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Access our comprehensive directory of trusted medical professionals in your area. 
            Find doctors by specialization, check their availability, and book appointments.
          </p>
          <Link 
            href={`/${currentSociety}/services/doctors`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
          >
            View Doctors Directory
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
} 