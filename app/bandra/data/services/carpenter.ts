export interface Product {
  name: string;
  description: string;
  price: number | string;
  unit: string;
}

export interface Vendor {
  name: string;
  products: Product[];
  mobile: string;
}

export const vendors: Vendor[] = [
  {
    name: 'Ajay Sharma',
    products: [{
      name: 'Carpentry',
      description: 'Carpentry services',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 9821314516'
  }
];
