import { FiAlertTriangle } from 'react-icons/fi';

export default function Disclaimer() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8 mb-4">
      <div className="flex items-start gap-3">
        <FiAlertTriangle className="text-yellow-600 w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-1">Important Notice:</p>
          <p>
            GharConnect is a technology platform that connects users with local vendors and service providers. 
            We do not take any responsibility for the contact information provided or the products/services 
            delivered by the listed vendors. Users are advised to verify vendor credentials and terms 
            before engaging their services.
          </p>
        </div>
      </div>
    </div>
  );
} 