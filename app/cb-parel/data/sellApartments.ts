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
    id: 't1-101',
    type: 'T1',
    price: 4500000,
    area: 650,
    bedrooms: 1,
    bathrooms: 1,
    description: 'Spacious 1BHK apartment with modern amenities and great natural lighting.',
    features: [
      'Modular Kitchen',
      'Parking Space',
      '24/7 Security',
      'Power Backup',
      'Lift'
    ],
    images: ['/images/t1-101-1.jpg', '/images/t1-101-2.jpg'],
    status: 'available',
    tower: 'Tower A',
    floor: 1,
    flatNumber: '101',
    postedDate: '2024-03-20',
    lastUpdated: '2024-03-20'
  },
  // Add more apartments as needed
]; 