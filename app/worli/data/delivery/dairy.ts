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
  photo?: string;
  areaServed?: string[];
  buildingServed?: string[];
}

export const vendors: Vendor[] = [
  {
    name: 'Agarwal Dairy',
    products: [{
      name: 'Cow Milk',
      description: 'Fresh cow milk delivered daily',
      price: 'Call for price',
      unit: 'litre'
    }],
    mobile: '+91 98201 80456 / 99304 94032',
    areaServed: [],
    buildingServed: []
  },
  {
    name: 'Gautam Dairy',
    products: [{
      name: 'Cow Milk',
      description: 'Fresh cow milk delivered daily',
      price: 'Call for price',
      unit: 'litre'
    }],
    mobile: '+91 92215 68717',
    areaServed: [],
    buildingServed: []
  }
]; 