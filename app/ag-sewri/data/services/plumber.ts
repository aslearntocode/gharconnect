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
    name: 'Quick Plumbers',
    services: [{
      name: 'Leak Fix',
      description: 'Fixing water leaks',
      price: 200,
      unit: 'job'
    }],
    mobile: '+91 90000 00007'
  }
]; 