export interface acService {
    id: string;
    name: string;
    description: string;
    price: string;
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
      price: "Call for price",
      duration: '1 hour',
      mobile: '8454987547',
      // image: '/images/services/plumber/leak-repair.jpg',
      category: 'repair'
    },
    {
      id: 'Hamid',
      name: 'Hamid',
      description: 'AC Service',
      price: "Call for price",
      duration: '1 hour',
      mobile: '+91 81696 38339',
      // image: '/images/services/plumber/leak-repair.jpg',
      category: 'repair'
    }
  ]; 