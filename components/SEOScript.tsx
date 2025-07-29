import Script from 'next/script';
import Head from 'next/head';

interface SEOScriptProps {
  location?: string;
  type?: 'rent' | 'sale' | 'pg' | 'shared';
  canonicalUrl?: string;
  title?: string;
  description?: string;
  noIndex?: boolean;
  imageUrl?: string;
}

export default function SEOScript({ 
  location, 
  type, 
  canonicalUrl, 
  title,
  description,
  noIndex = false,
  imageUrl = 'https://gharconnect.in/GC_Logo.png'
}: SEOScriptProps) {
  // Default canonical URL if not provided
  const defaultCanonicalUrl = canonicalUrl || 'https://gharconnect.in';
  
  // Default structured data for real estate
  const structuredData = location && type ? {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "GharConnect",
    "description": `Find ${type} apartments in ${location} with minimal brokerage fees. GharConnect offers the best ${type} deals with transparent pricing.`,
    "url": `https://gharconnect.in/${location.toLowerCase()}/${type}`,
    "telephone": "+91-9321314553",
    "email": "gharconnectindia@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressRegion": location === 'Mumbai' ? 'Maharashtra' : location === 'Bangalore' ? 'Karnataka' : 'Maharashtra',
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
    ],
    "logo": "https://gharconnect.in/GC_Logo.png",
    "image": imageUrl
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
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="GharConnect Community Platform" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@gharconnect" />
        <meta name="twitter:creator" content="@gharconnect" />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:image:alt" content="GharConnect Community Platform" />
        
        {/* Additional SEO meta tags */}
        <meta name="author" content="GharConnect" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content={location || "India"} />
        
        {/* Mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="msapplication-TileColor" content="#4F46E5" />
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