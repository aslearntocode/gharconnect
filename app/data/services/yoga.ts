export interface YogaService {
  id: string;
  name: string;
  description: string;
  services: {
    type: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'hatha' | 'vinyasa' | 'kids' | 'other';
  brand: string;
  inStock: boolean;
}

export const yogaServices: YogaService[] = [
  {
    id: 'hatha-1',
    name: 'Hatha Yoga',
    description: 'Traditional Hatha Yoga classes for all levels.',
    services: [
      { type: 'Single Class', price: 12.99, unit: 'class' },
      { type: 'Monthly Pass', price: 89.99, unit: 'month' }
    ],
    image: '/images/services/hatha-yoga.jpg',
    category: 'hatha',
    brand: 'Yoga Bliss',
    inStock: true
  },
  {
    id: 'vinyasa-1',
    name: 'Vinyasa Yoga',
    description: 'Dynamic Vinyasa flow classes.',
    services: [
      { type: 'Single Class', price: 14.99, unit: 'class' },
      { type: 'Monthly Pass', price: 99.99, unit: 'month' }
    ],
    image: '/images/services/vinyasa-yoga.jpg',
    category: 'vinyasa',
    brand: 'Yoga Bliss',
    inStock: true
  },
  {
    id: 'kids-1',
    name: 'Kids Yoga',
    description: 'Fun and engaging yoga classes for children.',
    services: [
      { type: 'Single Class', price: 9.99, unit: 'class' },
      { type: 'Monthly Pass', price: 69.99, unit: 'month' }
    ],
    image: '/images/services/kids-yoga.jpg',
    category: 'kids',
    brand: 'Yoga Kids',
    inStock: true
  }
]; 