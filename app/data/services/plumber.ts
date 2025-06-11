export interface PlumberService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  mobile: string;
  // image: string;
  category: 'repair' | 'installation' | 'emergency' | 'maintenance';
}

export const plumberServices: PlumberService[] = [
  {
    id: '1',
    name: 'Leak Repair',
    description: 'Fix water leaks and pipe damages',
    price: 79.99,
    duration: '2-4 hours',
    mobile: '9653303552',
    // image: '/images/services/plumber/leak-repair.jpg',
    category: 'repair'
  }
]; 