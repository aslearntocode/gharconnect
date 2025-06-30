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
    name: 'Amed Ali',
    services: [{
      name: 'Tailoring',
      description: 'Tailoring',
      price: 'Call for price',
      unit: 'piece'
    }],
    mobile: '+91 91109 58850'
  }, 
  {
    name: 'Saroj',
    services: [{
      name: 'Tailoring',
      description: 'Tailoring',
      price: 'Call for price',
      unit: 'piece'
    }],
    mobile: '+91 79850 90256'
  }
];
