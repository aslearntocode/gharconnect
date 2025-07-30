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
  areaServed?: string[];
  buildingServed?: string[];
}

export const vendors: Vendor[] = [
  {
    name: 'Arvind Fruit Seller',
    products: [{
      name: 'All Fruits',
      description: 'Fruits',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 89489 85961',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay','ICC','Ruparel Ariana']
  },
  {
    name: 'Vijay Fruit Seller',
    products: [{
      name: 'All Fruits',
      description: 'Fruits',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 98926 85559',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay','ICC','Ruparel Ariana']
  },
  {
    name: 'Surender Fruit Seller',
    products: [{
      name: 'All Fruits',
      description: 'Fruits',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 77150 51571',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay','ICC','Ruparel Ariana']
  },
  {
    name: 'Saldana (Fruits)',
    products: [{
      name: 'Fruits',
      description: 'Fruits',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 7406470702'
  },
  {
    name: 'Rahman Coconut Delivery',
    products: [{
      name: 'Coconut',
      description: 'Fresh coconuts',
      price: 'Call for price',
      unit: 'piece'
    }],
    mobile: '+91 82913 35456'
  },
  {
    name: 'Mayank Fresh Fruits Delivery',
    products: [{
      name: 'Fruits',
      description: 'Fresh fruits',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 70213 73761',
    areaServed: ['Worli'],
    buildingServed: ['All']
  }
];
