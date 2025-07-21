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
    name: 'Chandan',
    products: [{
      name: 'Carpentry',
      description: 'All types of carpentry work',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 91986 99981',
    areaServed: ['Parel'],
    buildingServed: ['All']
  },
  {
    name: 'Ajay Sharma',
    products: [{
      name: 'Carpentry',
      description: 'All types of carpentry work',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 9821314516',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Shoeb',
    products: [{
      name: 'Carpentry',
      description: 'All types of carpentry work',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 91672 28070',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Vinay',
    products: [{
      name: 'Carpentry',
      description: 'All types of carpentry work',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 93726 33491 / 91671 96255',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay', 'Ashok Gardens', 'ICC']
  }
];
