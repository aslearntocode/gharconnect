export interface Service {
  name: string;
  description: string;
  price: number | string;
  unit: string;
}

export interface Vendor {
  name: string;
  services: Service[];
  mobile: string;
  areaServed?: string;
  buildingServed?: string;
}

export const vendors: Vendor[] = [
  {
    name: 'Clean Homes',
    services: [{
      name: 'Regular Cleaning',
      description: 'Standard house cleaning service',
      price: '₹999',
      unit: 'visit'
    }],
    mobile: '+91 9000000001',
    areaServed: '',
    buildingServed: ''
  },
  {
    name: 'Sparkle & Shine',
    services: [{
      name: 'Deep Cleaning',
      description: 'Thorough deep cleaning service',
      price: '₹1999',
      unit: 'visit'
    }],
    mobile: '+91 9000000002',
    areaServed: '',
    buildingServed: ''
  },
  {
    name: 'House Cleaning Service',
    services: [{
      name: 'House Cleaning',
      description: 'Complete house cleaning',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 9876543214',
    areaServed: '',
    buildingServed: ''
  }
]; 