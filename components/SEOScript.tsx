import Script from 'next/script';
import Head from 'next/head';

interface SEOScriptProps {
  location?: string;
  type?: 'rent' | 'sale' | 'pg' | 'shared';
  canonicalUrl?: string;
  title?: string;
  description?: string;
  noIndex?: boolean;
}

export default function SEOScript({ 
  location, 
  type, 
  canonicalUrl, 
  title,
  description,
  noIndex = false 
}: SEOScriptProps) {
  // Default canonical URL if not provided
  const defaultCanonicalUrl = canonicalUrl || 'https://gharconnect.in';
  
  // Default structured data for real estate
  const structuredData = location && type ? {
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
  } : null;

  return (
    <>
      <Head>
        {/* Canonical URL */}
        <link rel="canonical" href={defaultCanonicalUrl} />
        
        {/* Meta robots tag */}
        <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
        
        {/* Additional meta tags for better SEO */}
        <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
        <meta name="bingbot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
        
        {/* Open Graph tags */}
        <meta property="og:url" content={defaultCanonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GharConnect" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@gharconnect" />
      </Head>
      
      {/* Structured data */}
      {structuredData && (
        <Script
          id={`seo-script-${location}-${type}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </>
  );
} 