export interface RentApartmentDetails {
  id: string;
  type: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';
  monthlyRent: number;
  securityDeposit: number;
  area: number; // in sq ft
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  description: string;
  features: string[];
  images: string[];
  status: 'available' | 'rented' | 'reserved';
  tower: string;
  facing: string;
  floor: number;
  flatNumber: string;
  postedDate: string;
  lastUpdated: string;
  furnishingStatus: 'fully-furnished' | 'semi-furnished' | 'unfurnished';
  availableFrom: string;
  maintenanceCharges: number;
}

export const rentApartments: RentApartmentDetails[] = [
  {
    id: 't1-201',
    type: 'T1',
    monthlyRent: 15000,
    securityDeposit: 30000,
    area: 950,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
    description: 'Well-maintained 2BHK apartment on highest floor available for rent with all modern amenities. Furnished with white goods. Corner flat with 180 degrees view of Parel and Atal Setu',
    features: [
      'Fully Furnished',
      'Parking Space',
      '24/7 Security',
      'Power Backup',
      'Lift',
      'Water Supply'
    ],
    images: ['/images/cb-1.jpg', '/images/cb-2.jpg'],
    status: 'available',
    tower: 'Crescent Bay',
    facing: 'City',
    floor: 2,
    flatNumber: '201',
    postedDate: '2025-06-13',
    lastUpdated: '2025-06-13',
    furnishingStatus: 'fully-furnished',
    availableFrom: '2025-07-05',
    maintenanceCharges: 2000
  },
  {
    id: 'icc-5001',
    type: 'T1',
    monthlyRent: 15000,
    securityDeposit: 30000,
    area: 750,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
    description: 'Well-maintained 2BHK apartment available for rent with all modern amenities.',
    features: [
      'Fully Furnished',
      'Parking Space',
      '24/7 Security',
      'Power Backup',
      'Lift',
      'Water Supply'
    ],
    images: ['/images/cb-1.jpg', '/images/cb-2.jpg'],
    status: 'available',
    tower: 'ICC',
    facing: 'Park',
    floor: 50,
    flatNumber: '5001',
    postedDate: '2025-06-10',
    lastUpdated: '2025-06-13',
    furnishingStatus: 'semi-furnished',
    availableFrom: '2025-06-13',
    maintenanceCharges: 2000
  },
  // Add more apartments as needed
]; 