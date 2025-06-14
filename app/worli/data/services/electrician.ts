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
    name: 'Munna Electrician',
    services: [{
      name: 'Electrician',
      description: 'Any electrical work',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 9653303552'
  }
]; 