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
    name: 'Mangilal',
    services: [{
      name: 'Electronics Repair',
      description: 'refrigerator, Washing Machine etc. repair',
      price: 'Call for price',
      unit: 'per repair'
    }],
    mobile: '+91 9892660223'
  }
];
