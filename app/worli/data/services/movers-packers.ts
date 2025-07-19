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
    name: 'Ravi Packers',
    services: [{
      name: 'Moving',
      description: 'Household moving and packing',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 98765 43210',
    areaServed: ['Worli'],
    buildingServed: ['All']
  },
  {
    name: 'Amardeep Packers',
    services: [{
      name: 'Packers & Movers',
      description: 'Packers & Movers within and Outside Buildings',
      price: 'Call for price',
      unit: 'per job'
    }], 
    mobile: '+91 80806 56767',
    areaServed: ['Worli'],
    buildingServed: ['All']
  }
];
