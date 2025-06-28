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
    mapUrl: string;
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
    price: '₹7,500/night',
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
      // 'Adventure Sports',
      'Bonfire',
      'Free WiFi',
      'Home Made Food'
    ],
    thingsToDo: [
      'Farm Tours',
      'Trekking',
      'Milking the cow',
    ],
    highlights: [
      'Organic Farm Experience',
      'Beautiful Farm View',
      'Luxury Accommodation',
      'Home Made Food'
    ],
    contactInfo: {
      phone: '+91 860504 47365',
      email: 'gharconnectindia@gmail.com',
      website: 'www.ayrafarms.com',
      social: 'https://www.instagram.com/theayrafarms/?hl=en'
    },
    location: {
      mapUrl: "https://www.google.com/maps/place/Ayra+Farms,+house+%23655,+BrahminVadi,+Talavli+village,+Chikhali,+Guhagar,+Ratnagiri,+Maharashtra+415719/data=!4m2!3m1!1s0x3be9e5451cbea55b:0x233928cacc099708?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI1LjIxLjEYACCenQoqfSw5NDI1OTU1MTk0Mjc1MzEyLDk0MjIzMjk5LDk0MjE2NDEzLDk0MjEyNDk2LDk0MjA3Mzk0LDk0MjA3NTA2LDk0MjA4NTA2LDk0MjE3NTIzLDk0MjE4NjUzLDk0MjI5ODM5LDQ3MDg0MzkzLDk0MjEzMjAwLDk0MjU4MzI1QgJJTg%3D%3D&skid=80b3006b-ebb1-46c6-b767-36c0bbce5cc8"
    },
    availability: 'Available year-round',
    propertyType: 'Farm Resort',
    size: '2.5 acres'
  }
];

export const getPropertyLink = (society: string, propertyId: string, category: string): string => {
  // Convert category to URL-friendly format
  const categoryPath = category.toLowerCase().replace(/\s+/g, '-');
  return `/${society}/travel-vlogs/${categoryPath}/${propertyId}`;
}; 