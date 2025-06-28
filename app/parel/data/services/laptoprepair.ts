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
    name: 'Raees',
    products: [{
      name: 'Laptop Repair',
      description: 'Professional laptop repair and maintenance services',
      price: 'Call for price',
      unit: 'service'
    }],
    mobile: '+91 9930952258'
  },
  {
    name: 'Born Computers Sailesh',
    products: [{
      name: 'Laptop Repair',
      description: 'Professional laptop repair and maintenance services',
      price: 'Call for price',
      unit: 'service'
    }],
    mobile: '+91 98210 52256'
  },
  {
    name: 'Vijay',
    products: [{
      name: 'Laptop Repair',
      description: 'Professional laptop repair and maintenance services',
      price: 'Call for price',
      unit: 'service'
    }],
    mobile: '+91 98673 21454'
  },
  {
    name: 'Jay Shroff',
    products: [{
      name: 'Laptop Repair',
      description: 'Professional laptop repair and maintenance services',
      price: 'Call for price',
      unit: 'service'
    }],
    mobile: '+91 98210 91121'
  }
];
