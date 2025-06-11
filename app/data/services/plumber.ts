export interface PlumberService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  category: 'repair' | 'installation' | 'emergency' | 'maintenance';
}

export const plumberServices: PlumberService[] = [
  {
    id: '1',
    name: 'Leak Repair',
    description: 'Fix water leaks and pipe damages',
    price: 79.99,
    duration: '2-4 hours',
    image: '/images/services/plumber/leak-repair.jpg',
    category: 'repair'
  },
  {
    id: '2',
    name: 'Fixture Installation',
    description: 'Install new faucets, showers, and toilets',
    price: 59.99,
    duration: '1-2 hours',
    image: '/images/services/plumber/fixture-installation.jpg',
    category: 'installation'
  },
  {
    id: '3',
    name: 'Emergency Service',
    description: '24/7 emergency plumbing repairs',
    price: 119.99,
    duration: '1-3 hours',
    image: '/images/services/plumber/emergency.jpg',
    category: 'emergency'
  },
  {
    id: '4',
    name: 'Drain Cleaning',
    description: 'Professional drain cleaning and unclogging',
    price: 89.99,
    duration: '1-2 hours',
    image: '/images/services/plumber/drain-cleaning.jpg',
    category: 'maintenance'
  }
]; 