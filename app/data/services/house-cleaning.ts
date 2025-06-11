export interface HouseCleaningService {
  id: string;
  name: string;
  description: string;
  services: {
    type: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'regular' | 'deep' | 'move' | 'other';
  brand: string;
  inStock: boolean;
}

export const houseCleaningServices: HouseCleaningService[] = [
  {
    id: 'regular-1',
    name: 'Regular Cleaning',
    description: 'Standard house cleaning service',
    services: [
      { type: '1 BHK', price: 49.99, unit: 'visit' },
      { type: '2 BHK', price: 69.99, unit: 'visit' },
      { type: '3 BHK', price: 89.99, unit: 'visit' }
    ],
    image: '/images/services/regular-cleaning.jpg',
    category: 'regular',
    brand: 'Clean Homes',
    inStock: true
  },
  {
    id: 'deep-1',
    name: 'Deep Cleaning',
    description: 'Thorough deep cleaning service',
    services: [
      { type: '1 BHK', price: 99.99, unit: 'visit' },
      { type: '2 BHK', price: 149.99, unit: 'visit' },
      { type: '3 BHK', price: 199.99, unit: 'visit' }
    ],
    image: '/images/services/deep-cleaning.jpg',
    category: 'deep',
    brand: 'Clean Homes',
    inStock: true
  },
  {
    id: 'move-1',
    name: 'Move In/Out Cleaning',
    description: 'Complete cleaning for moving',
    services: [
      { type: '1 BHK', price: 149.99, unit: 'visit' },
      { type: '2 BHK', price: 199.99, unit: 'visit' },
      { type: '3 BHK', price: 249.99, unit: 'visit' }
    ],
    image: '/images/services/move-cleaning.jpg',
    category: 'move',
    brand: 'Clean Homes',
    inStock: true
  },
  {
    id: 'regular-2',
    name: 'Premium Cleaning',
    description: 'Premium house cleaning service',
    services: [
      { type: '1 BHK', price: 69.99, unit: 'visit' },
      { type: '2 BHK', price: 99.99, unit: 'visit' },
      { type: '3 BHK', price: 129.99, unit: 'visit' }
    ],
    image: '/images/services/premium-cleaning.jpg',
    category: 'regular',
    brand: 'Sparkle & Shine',
    inStock: true
  },
  {
    id: 'deep-2',
    name: 'Eco Deep Cleaning',
    description: 'Eco-friendly deep cleaning service',
    services: [
      { type: '1 BHK', price: 119.99, unit: 'visit' },
      { type: '2 BHK', price: 169.99, unit: 'visit' },
      { type: '3 BHK', price: 219.99, unit: 'visit' }
    ],
    image: '/images/services/eco-cleaning.jpg',
    category: 'deep',
    brand: 'Sparkle & Shine',
    inStock: true
  },
  {
    id: 'move-2',
    name: 'Premium Move Cleaning',
    description: 'Premium cleaning for moving',
    services: [
      { type: '1 BHK', price: 179.99, unit: 'visit' },
      { type: '2 BHK', price: 229.99, unit: 'visit' },
      { type: '3 BHK', price: 279.99, unit: 'visit' }
    ],
    image: '/images/services/premium-move.jpg',
    category: 'move',
    brand: 'Sparkle & Shine',
    inStock: true
  }
]; 