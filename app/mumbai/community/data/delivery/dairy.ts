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
    mobile: '+91 9820180456 / 9930494032',
    areaServed: ['Parel', 'Worli'],
    buildingServed: ['All']
  },
  {
    name: 'Gautam Dairy',
    products: [{
      name: 'Cow Milk',
      description: 'Fresh cow milk delivered daily',
      price: 'Call for price',
      unit: 'litre'
    }],
    mobile: '+91 9221568717',
    areaServed: ['Parel', 'Worli'],
    buildingServed: ['L&T Crescent Bay']
  }
]; 