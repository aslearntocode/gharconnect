export interface ElectricianService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  mobile: string;
  // image: string;
  category: 'repair' | 'installation' | 'emergency' | 'maintenance';
}

export const electricianServices: ElectricianService[] = [
  {
    id: 'muuna_electrician',
    name: 'Munna Electrician',
    description: 'Fix electrical issues and power problems',
    price: 1000,
    duration: '1 hour',
    mobile: '9653303552',
    // image: '/images/services/electrician/repair.jpg',
    category: 'repair'
  }
]; 