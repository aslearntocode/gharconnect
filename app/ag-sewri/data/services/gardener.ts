export interface GardenerService {
  id: string;
  name: string;
  description: string;
  services: {
    type: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'maintenance' | 'landscaping' | 'plants' | 'other';
  brand: string;
  inStock: boolean;
}

export const gardenerServices: GardenerService[] = [
  {
    id: 'maintenance-1',
    name: 'Ramwishwas',
    description: 'Regular maintenance for your garden, including weeding, pruning, and cleaning.',
    services: [
      { type: 'Small Garden', price: 299, unit: 'visit' },
      { type: 'Medium Garden', price: 499, unit: 'visit' },
      { type: 'Large Garden', price: 799, unit: 'visit' }
    ],
    image: '/images/services/garden-maintenance.jpg',
    category: 'maintenance',
    brand: 'Green Thumb',
    inStock: true
  }
]; 