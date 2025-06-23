interface SEOContentProps {
  location: string;
  type: 'rent' | 'sale';
  priceRange?: string;
  propertyTypes?: string[];
}

export default function SEOContent({ 
  location, 
  type, 
  priceRange = "₹15,000 to ₹1,00,000+", 
  propertyTypes = ["1BHK", "2BHK", "3BHK", "4BHK"]
}: SEOContentProps) {
  return (
    <div className="sr-only">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Why Choose GharConnect for {location} {type === 'rent' ? 'Rentals' : 'Sales'}?
      </h3>
      <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            Low Brokerage {type === 'rent' ? 'Rental' : 'Sale'} Apartments in {location}
          </h4>
          <p className="mb-3">
            Looking for {type} apartments in {location} with minimal brokerage? GharConnect offers the most competitive 
            brokerage rates in {location}, Mumbai. Our transparent pricing model ensures you save money while finding 
            your perfect home.
          </p>
          <p className="mb-3">
            From {propertyTypes.join(', ')} apartments, we have a wide range of {type} options in {location}'s most sought-after 
            societies and buildings. Whether you need furnished, semi-furnished, or unfurnished apartments, 
            we've got you covered.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {location} {type === 'rent' ? 'Rental' : 'Sale'} Market Expertise
          </h4>
          <p className="mb-3">
            Our deep understanding of the {location} {type} market helps us provide the best deals and guidance. 
            We know the local area, building quality, and {type} trends to help you make informed decisions.
          </p>
          <p className="mb-3">
            With properties ranging from {priceRange} per month, we cater to all budgets. 
            Our {type} apartments in {location} include premium societies, standalone buildings, and modern complexes.
          </p>
        </div>
      </div>
      
      {/* Additional SEO content for search engines */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 mb-2">
          {location} {type === 'rent' ? 'Rental' : 'Sale'} Market Overview
        </h4>
        <p className="mb-3">
          {location} is one of Mumbai's most sought-after residential areas, offering excellent connectivity 
          to major business districts and lifestyle amenities. Our {type} services in {location} are designed 
          to help you find the perfect property with minimal hassle and maximum value.
        </p>
        <p className="mb-3">
          Whether you're looking for {type} apartments near {location} station, {location} market, or 
          {location} business district, GharConnect provides comprehensive {type} solutions with 
          transparent pricing and minimal brokerage fees.
        </p>
      </div>
    </div>
  );
} 