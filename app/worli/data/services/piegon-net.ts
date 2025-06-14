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
    name: 'Pigeon Net Services',
    products: [{
      name: 'Pigeon Net Installation',
      description: 'Professional pigeon net installation and repair services',
      price: 'Call for price',
      unit: 'service'
    }],
    mobile: '+91 9930952258'
  }
];
