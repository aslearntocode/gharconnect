export interface PestControlService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  mobile: string;
  category: 'termite' | 'rodent' | 'general' | 'other';
}

export const pestControlServices: PestControlService[] = [
  {
    id: 'pest_control',
    name: 'Pest Control',
    description: 'Subscribe to get effective termite removal and prevention',
    price: 3000,
    duration: '1 year',
    mobile: '9867898920',
    category: 'termite'
  }
  // Add more services as needed
];
