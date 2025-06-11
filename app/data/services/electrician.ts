export interface ElectricianService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  category: 'repair' | 'installation' | 'emergency' | 'maintenance';
}

export const electricianServices: ElectricianService[] = [
  {
    id: 'muuna_electrician',
    name: 'Munna Electrician',
    description: 'Fix electrical issues and power problems',
    price: 100,
    duration: '1 hour',
    image: '/images/services/electrician/repair.jpg',
    category: 'repair'
  },
  {
    id: '2',
    name: 'Light Installation',
    description: 'Install new lights, fans, and electrical fixtures',
    price: 49.99,
    duration: '1-2 hours',
    image: '/images/services/electrician/light-installation.jpg',
    category: 'installation'
  },
  {
    id: '3',
    name: 'Emergency Service',
    description: '24/7 emergency electrical repairs',
    price: 99.99,
    duration: '1-3 hours',
    image: '/images/services/electrician/emergency.jpg',
    category: 'emergency'
  },
  {
    id: '4',
    name: 'Electrical Inspection',
    description: 'Complete electrical system inspection and maintenance',
    price: 89.99,
    duration: '2-3 hours',
    image: '/images/services/electrician/inspection.jpg',
    category: 'maintenance'
  }
]; 