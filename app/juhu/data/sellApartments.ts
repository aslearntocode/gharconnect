export interface ApartmentDetails {
  id: string;
  type: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';
  price: number;
  area: number; // in sq ft
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  tower: string;
  floor: number;
  flatNumber: string;
  postedDate: string;
  lastUpdated: string;
}

export const sellApartments: ApartmentDetails[] = [
  {
    id: 'icc-5501',
    type: 'T1',
    price: 4500000,
    area: 750,
    bedrooms: 2,
    bathrooms: 2,
    description: 'Spacious 2BHK apartment with modern amenities and great natural lighting.',
    features: [
      'Modular Kitchen',
      'Parking Space',
      '24/7 Security',
      'Power Backup',
      'Lift'
    ],
    images: ['/images/t1-101-1.jpg', '/images/t1-101-2.jpg'],
    status: 'available',
    tower: 'ICC',
    floor: 55,
    flatNumber: '5501',
    postedDate: '2025-06-10',
    lastUpdated: '2025-06-13'
  },
  // Add more apartments as needed
]; 