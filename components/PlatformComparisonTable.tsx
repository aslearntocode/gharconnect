import React from 'react';

interface PlatformData {
  feature: string;
  'GharConnect': string;
  '99acres': string;
  'Housing': string;
  'NoBroker': string;
}

const platformData: PlatformData[] = [
  { feature: 'Founded', 'GharConnect': '2025', '99acres': '2005', 'Housing': '2012', 'NoBroker': '2014' },
  { feature: 'Ownership', 'GharConnect': 'Founder-owned startup', '99acres': 'Info Edge (Naukri)', 'Housing': 'REA Group', 'NoBroker': 'Private (Tiger Global-backed)' },
  { feature: 'Primary Offering', 'GharConnect': 'Society-based listings & services', '99acres': 'Property listings (rent/sale)', 'Housing': 'Listings & insights', 'NoBroker': 'Broker-free transactions' },
  { feature: 'Brokerage Model', 'GharConnect': 'Society-led with minimal brokerage, no brokers allowed', '99acres': 'Broker-driven', 'Housing': 'Mixed (owners + brokers)', 'NoBroker': 'No brokers allowed' },
  { feature: 'Paid Advertising', 'GharConnect': 'Planned – society ads', '99acres': 'Yes – listings, builders', 'Housing': 'Yes – featured listings', 'NoBroker': 'Yes – paid visibility' },
  { feature: 'Rental Agreements & Legal', 'GharConnect': 'Yes – e-agreement and tripartite agreements for security deposit (planned)', '99acres': 'Yes – legal services', 'Housing': 'Yes – standard docs', 'NoBroker': 'Yes – e-agreements' },
  { feature: 'Society Services', 'GharConnect': 'Yes – verified providers', '99acres': 'No', 'Housing': 'Limited', 'NoBroker': 'Yes – moving, cleaning' },
  { feature: 'Community Features', 'GharConnect': 'Yes – classifieds, vacation stories', '99acres': 'No', 'Housing': 'No', 'NoBroker': 'No' },
  { feature: 'Unique Proposition', 'GharConnect': 'Community-first + hyperlocal', '99acres': 'Legacy + reach', 'Housing': 'Visual design + insights', 'NoBroker': 'Zero brokerage + services' },
  { feature: 'Mobile App', 'GharConnect': 'Yes (In Progress)', '99acres': 'Yes (iOS/Android)', 'Housing': 'Yes', 'NoBroker': 'Yes' },
  { feature: 'Target Audience', 'GharConnect': 'Residents and property seekers', '99acres': 'Buyers, sellers, brokers', 'Housing': 'Buyers, tenants', 'NoBroker': 'Cost-conscious renters' },
  { feature: 'Geographic Reach', 'GharConnect': 'Local focus – society-driven', '99acres': 'Pan-India', 'Housing': 'Pan-India', 'NoBroker': 'Pan-India' },
  { feature: 'Monetization Model', 'GharConnect': 'Ads, renovation quotes, services', '99acres': 'Ads, featured listings', 'Housing': 'Subscriptions, premium listings', 'NoBroker': 'Services & premium plans' },
];

const PlatformComparisonTable: React.FC = () => {
  return (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm" aria-label="Comparison of Indian Real Estate Platforms: GharConnect.in, 99acres.com, Housing.com, NoBroker.com">
        <caption className="sr-only">
          Detailed feature comparison of Indian real estate platforms: GharConnect.in, 99acres.com, Housing.com, and NoBroker.com.
        </caption>
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Feature / Platform
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              GharConnect.in
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              99acres.com
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Housing.com
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              NoBroker.com
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {platformData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 max-w-xs break-words text-sm font-medium text-gray-900 border-r">
                {row.feature}
              </td>
              <td className="px-6 py-4 max-w-xs break-words text-sm text-gray-500">
                {row['GharConnect']}
              </td>
              <td className="px-6 py-4 max-w-xs break-words text-sm text-gray-500">
                {row['99acres']}
              </td>
              <td className="px-6 py-4 max-w-xs break-words text-sm text-gray-500">
                {row['Housing']}
              </td>
              <td className="px-6 py-4 max-w-xs break-words text-sm text-gray-500">
                {row['NoBroker']}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-gray-500 italic">
        Note: Information is accurate as of June 2025 and based on public sources and platform analysis. GharConnect is currently in beta, and some features are under development.
      </p>
    </div>
  );
};

export default PlatformComparisonTable; 