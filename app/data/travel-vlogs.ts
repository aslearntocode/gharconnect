export interface Property {
  id: string;
  title: string;
  description: string;
  category: string;
  address: string;
  price: string;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  amenities: string[];
  thingsToDo: string[];
  highlights: string[];
  contactInfo: {
    phone: string;
    email?: string;
    website?: string;
    social?: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  availability: string;
  propertyType: string;
  size: string;
  bedrooms?: number;
  bathrooms?: number;
}

export const properties: Property[] = [
  {
    id: 'ayra-farms',
    title: 'Ayra Farms',
    description: 'A perfect blend of luxury and nature, offering farm-to-table dining and outdoor activities just hours from Mumbai.',
    category: 'Within India',
    address: 'Guhaghar, Maharashtra 410201, India',
    price: '₹8,500/night',
    rating: 4.5,
    reviewCount: 1,
    image: '/properties/ayra-farms-1.png',
    images: [
      '/properties/ayra-farms-1.png',
      '/properties/ayra-farms-2.png',
      '/properties/ayra-farms-3.png',
      '/properties/ayra-farms-4.png'
    ],
    amenities: [
      'Organic Farm',
      'Plunge Pool',
      'Adventure Sports',
      'Bonfire',
      'Free WiFi'
    ],
    thingsToDo: [
      'Farm Tours',
      'Trekking'
    ],
    highlights: [
      'Organic Farm Experience',
      'Mountain Views',
      'Adventure Activities',
      'Luxury Accommodation'
    ],
    contactInfo: {
      phone: '+91-22-1234-5678',
      email: 'bookings@aryanfarms.com',
      website: 'www.aryanfarms.com',
      social: 'https://www.instagram.com/theayrafarms/?hl=en'
    },
    location: {
      latitude: 19.0760,
      longitude: 72.8777
    },
    availability: 'Available year-round',
    propertyType: 'Farm Resort',
    size: '25 acres'
  },
  {
    id: 'bali-villa',
    title: 'Bali Luxury Villa',
    description: 'Stunning beachfront villa with infinity pool, private beach access, and breathtaking ocean views in the heart of Bali.',
    category: 'Outside India',
    address: 'Seminyak, Bali 80361, Indonesia',
    price: '₹15,000/night',
    rating: 4.8,
    reviewCount: 3,
    image: '/properties/bali-villa-1.png',
    images: [
      '/properties/bali-villa-1.png',
      '/properties/bali-villa-2.png',
      '/properties/bali-villa-3.png',
      '/properties/bali-villa-4.png'
    ],
    amenities: [
      'Infinity Pool',
      'Private Beach Access',
      'Spa Services',
      'Butler Service',
      'Free WiFi'
    ],
    thingsToDo: [
      'Beach Activities',
      'Spa Treatments'
    ],
    highlights: [
      'Beachfront Location',
      'Infinity Pool',
      'Luxury Villa',
      'Ocean Views'
    ],
    contactInfo: {
      phone: '+62-361-123-4567',
      email: 'bookings@baliluxuryvilla.com',
      website: 'www.baliluxuryvilla.com',
      social: 'https://www.instagram.com/baliluxuryvilla/'
    },
    location: {
      latitude: -8.4095,
      longitude: 115.1889
    },
    availability: 'Available year-round',
    propertyType: 'Luxury Villa',
    size: '500 sqm',
    bedrooms: 4,
    bathrooms: 3
  }
];

export const getPropertyLink = (society: string, propertyId: string, category: string): string => {
  // Convert category to URL-friendly format
  const categoryPath = category.toLowerCase().replace(/\s+/g, '-');
  return `/${society}/travel-vlogs/${categoryPath}/${propertyId}`;
}; 