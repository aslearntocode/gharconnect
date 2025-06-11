export interface PhysicalTrainingService {
  id: string;
  name: string;
  description: string;
  services: {
    type: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'personal' | 'group' | 'special' | 'other';
  brand: string;
  inStock: boolean;
}

export const physicalTrainingServices: PhysicalTrainingService[] = [
  {
    id: 'personal-1',
    name: 'Personal Training',
    description: 'One-on-one personal training sessions tailored to your goals.',
    services: [
      { type: 'Single Session', price: 29.99, unit: 'session' },
      { type: '5 Sessions', price: 139.99, unit: 'package' },
      { type: '10 Sessions', price: 259.99, unit: 'package' }
    ],
    image: '/images/services/personal-training.jpg',
    category: 'personal',
    brand: 'FitPro',
    inStock: true
  },
  {
    id: 'group-1',
    name: 'Group Training',
    description: 'Fun and motivating group fitness classes.',
    services: [
      { type: 'Single Class', price: 14.99, unit: 'class' },
      { type: 'Monthly Pass', price: 99.99, unit: 'month' }
    ],
    image: '/images/services/group-training.jpg',
    category: 'group',
    brand: 'FitPro',
    inStock: true
  },
  {
    id: 'special-1',
    name: 'Special Bootcamp',
    description: 'Intensive bootcamp for rapid results.',
    services: [
      { type: '1 Week', price: 59.99, unit: 'week' },
      { type: '2 Weeks', price: 109.99, unit: '2 weeks' }
    ],
    image: '/images/services/bootcamp.jpg',
    category: 'special',
    brand: 'BootcampX',
    inStock: true
  }
]; 