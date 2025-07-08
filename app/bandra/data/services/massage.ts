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

export const vendors: Vendor[] = [
  {
    name: 'Bandra Wellness Center',
    services: [{
      name: 'Swedish Massage',
      description: 'Relaxing full body massage with therapeutic oils',
      price: '₹2000',
      unit: 'hour'
    }],
    mobile: '+91 9876543220',
    areaServed: ['Bandra'],
    buildingServed: ['All Buildings']
  }
];
