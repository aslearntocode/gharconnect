export interface GardenerService {
  id: string;
  name: string;
  description: string;
  category: 'maintenance' | 'landscaping' | 'plants' | 'other';
  mobile: string;
  products: {
    name: string;
    description: string;
    price: number | string;
    unit: string;
  }[];
  areaServed?: string;
  buildingServed?: string;
}

export const gardenerServices: GardenerService[] = [
  {
    id: 'maintenance-1',
    name: 'Ramwishwas',
    description: 'Regular maintenance for your garden, including weeding, pruning, and cleaning.',
    category: 'maintenance',
    mobile: '+91 9561295795',
    products: [
      {
        name: 'Gardening',
        description: 'Regular maintenance for your garden, including weeding, pruning, and cleaning.',
        price: 'Call for price',
        unit: 'service'
      }
    ],
    areaServed: '',
    buildingServed: ''
  },
  {
    id: 'maintenance-2',
    name: 'Rajesh',
    description: 'Regular maintenance for your garden, including weeding, pruning, and cleaning.',
    category: 'maintenance',
    mobile: '+91 8369550450',
    products: [
      {
        name: 'Gardening',
        description: 'Regular maintenance for your garden, including weeding, pruning, and cleaning.',
        price: 'Call for price',
        unit: 'service'
      }
    ]
  }
]; 