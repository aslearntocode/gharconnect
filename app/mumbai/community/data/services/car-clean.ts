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
    name: 'Srikant Car Wash',
    services: [{
      name: 'Basic Car Wash',
      description: 'Exterior wash, interior cleaning, and tire cleaning',
      price: '₹700/800',
      unit: 'car'
    }],
    mobile: '+91 8454892526',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  }
];
