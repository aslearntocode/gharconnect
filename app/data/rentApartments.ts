export interface RentApartmentDetails {
  id: string;
  type: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';
  monthlyRent: number;
  securityDeposit: number;
  area: number; // in sq ft
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  images: string[];
  status: 'available' | 'rented' | 'reserved';
  tower: string;
  floor: number;
  flatNumber: string;
  postedDate: string;
  lastUpdated: string;
  furnishingStatus: 'furnished' | 'semi-furnished' | 'unfurnished';
  availableFrom: string;
  maintenanceCharges: number;
}

export const rentApartments: RentApartmentDetails[] = [
  {
    id: 't1-201',
    type: 'T1',
    monthlyRent: 15000,
    securityDeposit: 30000,
    area: 650,
    bedrooms: 1,
    bathrooms: 1,
    description: 'Well-maintained 1BHK apartment available for rent with all modern amenities.',
    features: [
      'Fully Furnished',
      'Parking Space',
      '24/7 Security',
      'Power Backup',
      'Lift',
      'Water Supply'
    ],
    images: ['/images/t1-201-1.jpg', '/images/t1-201-2.jpg'],
    status: 'available',
    tower: 'Tower B',
    floor: 2,
    flatNumber: '201',
    postedDate: '2024-03-20',
    lastUpdated: '2024-03-20',
    furnishingStatus: 'furnished',
    availableFrom: '2024-04-01',
    maintenanceCharges: 2000
  },
  // Add more apartments as needed
]; 