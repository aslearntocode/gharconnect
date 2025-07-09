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
    name: 'Farm Fresh Eggs',
    products: [
      {
        name: 'Farm (Desi) Eggs',
        description: 'Fresh farm eggs delivered daily',
        price: '₹156',
        unit: 'dozen'
      },
      {
        name: 'Country (White) Eggs',
        description: 'Country eggs delivered daily',
        price: '₹84',
        unit: 'dozen'
      }
    ],
    mobile: '+91 93213 14553',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay','Ashok Tower','Ashok Garden']
  }
];
