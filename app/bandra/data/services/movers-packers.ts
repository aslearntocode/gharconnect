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
    mobile: '+91 96573 00088'
  },
  {
    name: 'Pack N',
    services: [{
      name: 'Packers & Movers',
      description: 'Professional packing and moving',
      price: 'Call for price',
      unit: 'per shift'
    }],
    mobile: '+91 80806 56767'
  }
];
