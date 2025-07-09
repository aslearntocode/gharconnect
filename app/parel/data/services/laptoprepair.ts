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
    name: 'Raees',
    products: [{
      name: 'Laptop Repair',
      description: 'Professional laptop repair and maintenance services',
      price: 'Call for price',
      unit: 'service'
    }],
    mobile: '+91 99309 52258',
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    name: 'Born Computers Sailesh',
    products: [{
      name: 'Laptop Repair',
      description: 'Professional laptop repair and maintenance services',
      price: 'Call for price',
      unit: 'service'
    }],
    mobile: '+91 98210 52256',
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    name: 'Vijay',
    products: [{
      name: 'Laptop Repair',
      description: 'Professional laptop repair and maintenance services',
      price: 'Call for price',
      unit: 'service'
    }],
    mobile: '+91 98673 21454',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Jay Shroff',
    products: [{
      name: 'Laptop Repair',
      description: 'Professional laptop repair and maintenance services',
      price: 'Call for price',
      unit: 'service'
    }],
    mobile: '+91 98210 91121',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Laptop Repair Center',
    products: [{
      name: 'Laptop Repair',
      description: 'All brands laptop repair',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 98765 43212',
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    name: 'Techno Laptop',
    products: [{
      name: 'Laptop Repair',
      description: 'All brands laptop repair',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 98709 37946',
    areaServed: ['All'],
    buildingServed: ['All']
  }
];
