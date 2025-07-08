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
  areaServed?: string[];
  buildingServed?: string[];
}

export const pestControlServices: Vendor[] = [
  {
    name: 'Pest Control',
    services: [{
      name: 'Pest Control',
      description: 'All types of pest control',
      price: 'Call for price',
      unit: 'job'
    }],
  mobile: '+91 98678 98920',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  }
  // Add more services as needed
];
