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
    name: 'Archana Massage',
    services: [{
      name: 'Massage',
      description: 'Massage for relaxation and stress relief',
      price: 'Call for price',
      unit: 'hour'
    }],
    mobile: '+91 81084 54721 / 90763 83998',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Ritu Massage',
    services: [{
      name: 'Massage',
      description: 'Massage for relaxation and stress relief',
      price: 'Call for price',
      unit: 'hour'
    }],
    mobile: '+91 95710 24626',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  }
];
