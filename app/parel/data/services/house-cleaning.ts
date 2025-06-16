export interface Service {
  name: string;
  description: string;
  price: number | string;
  unit: string;
  image: string;
}

export interface Vendor {
  name: string;
  services: Service[];
  mobile: string;
  photo: string;
}

export const vendors: Vendor[] = [
  {
    name: 'Clean Homes',
    services: [{
      name: 'Regular Cleaning',
      description: 'Standard house cleaning service',
      price: '₹999',
      unit: 'visit',
      image: '/GC_Logo.png'
    }],
    mobile: '+91 9000000001',
    photo: '/GC_Logo.png'
  },
  {
    name: 'Sparkle & Shine',
    services: [{
      name: 'Deep Cleaning',
      description: 'Thorough deep cleaning service',
      price: '₹1999',
      unit: 'visit',
      image: '/GC_Logo.png'
    }],
    mobile: '+91 9000000002',
    photo: '/GC_Logo.png'
  }
]; 