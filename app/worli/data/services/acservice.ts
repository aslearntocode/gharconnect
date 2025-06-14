export interface acService {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    mobile: string;
    // image: string;
    category: 'repair' | 'installation' | 'emergency' | 'maintenance';
  }
  
  export const acServiceServices: acService[] = [
    {
      id: 'Azhar_ali',
      name: 'Azhar Ali',
      description: 'Fix water leaks and pipe damages',
      price: 1000,
      duration: '1 hour',
      mobile: '8454987547',
      // image: '/images/services/plumber/leak-repair.jpg',
      category: 'repair'
    }
  ]; 