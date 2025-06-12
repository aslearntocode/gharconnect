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
    name: 'Bright Sparks',
    services: [{
      name: 'Fan Installation',
      description: 'Ceiling fan installation',
      price: 150,
      unit: 'job'
    }],
    mobile: '+91 90000 00008'
  }
]; 