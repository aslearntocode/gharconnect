import Script from 'next/script';

interface SEOScriptProps {
  location: string;
  type: 'rent' | 'sale' | 'pg' | 'shared';
}

export default function SEOScript({ location, type }: SEOScriptProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "GharConnect",
    "description": `Find ${type} apartments in ${location}, Mumbai with minimal brokerage fees. GharConnect offers the best ${type} deals with transparent pricing.`,
    "url": `https://gharconnect.in/${location.toLowerCase()}/${type}`,
    "telephone": "+91-9321314553",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressRegion": "Mumbai",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "City",
      "name": location
    },
    "serviceType": `${type === 'rent' ? 'Rental' : type === 'sale' ? 'Sale' : type === 'pg' ? 'PG' : 'Shared'} Services`,
    "priceRange": "₹₹",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${location} ${type === 'rent' ? 'Rental' : type === 'sale' ? 'Sale' : type === 'pg' ? 'PG' : 'Shared'} Properties`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Apartment",
            "name": `${location} ${type === 'rent' ? 'Rental' : type === 'sale' ? 'Sale' : type === 'pg' ? 'PG' : 'Shared'} Apartments`,
            "description": `Premium ${type} apartments in ${location} with minimal brokerage fees`
          }
        }
      ]
    },
    "sameAs": [
      "https://gharconnect.in"
    ]
  };

  return (
    <Script
      id={`seo-script-${location}-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
} 