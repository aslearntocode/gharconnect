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
    name: 'Happy Packers & Movers',
    services: [{
      name: 'Packers & Movers',
      description: 'Complete packing, loading, transport, and unpacking',
      price: 'Call for price',
      unit: 'per shift'
    }],
    mobile: '+91 96573 00088',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Pack N',
    services: [{
      name: 'Packers & Movers',
      description: 'Professional packing and moving',
      price: 'Call for price',
      unit: 'per shift'
    }],
    mobile: '+91 80806 56767',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Ravi Packers',
    services: [{
      name: 'Moving',
      description: 'Household moving and packing',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 9876543210',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  }
];
