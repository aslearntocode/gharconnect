export interface KidsClassService {
  id: string;
  name: string;
  description: string;
  services: {
    type: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'art' | 'music' | 'sports' | 'other';
  brand: string;
  inStock: boolean;
}

export const kidsClassesServices: KidsClassService[] = [
  {
    id: 'art-1',
    name: 'Art Classes',
    description: 'Creative art classes for kids of all ages.',
    services: [
      { type: 'Single Class', price: 11.99, unit: 'class' },
      { type: 'Monthly Pass', price: 79.99, unit: 'month' }
    ],
    image: '/images/services/art-class.jpg',
    category: 'art',
    brand: 'Creative Kids',
    inStock: true
  },
  {
    id: 'music-1',
    name: 'Music Classes',
    description: 'Fun music lessons for children.',
    services: [
      { type: 'Single Class', price: 13.99, unit: 'class' },
      { type: 'Monthly Pass', price: 89.99, unit: 'month' }
    ],
    image: '/images/services/music-class.jpg',
    category: 'music',
    brand: 'Creative Kids',
    inStock: true
  },
  {
    id: 'sports-1',
    name: 'Sports Coaching',
    description: 'Sports coaching and fitness for kids.',
    services: [
      { type: 'Single Session', price: 14.99, unit: 'session' },
      { type: 'Monthly Pass', price: 99.99, unit: 'month' }
    ],
    image: '/images/services/sports-class.jpg',
    category: 'sports',
    brand: 'Active Kids',
    inStock: true
  }
]; 