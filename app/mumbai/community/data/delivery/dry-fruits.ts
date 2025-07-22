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
    name: 'Urban Tray',
    products: [
      {
        name: '24+ Premium Dry Fruits',
        description: 'Wide range of premium dry fruits including almonds, cashews, pistachios, walnuts, raisins, dates, and more. All products are of premium quality.',
        price: 'Price listed in the image',
        unit: 'gms'
      }
    ],
    mobile: '+91 9004660290',
    photo: '/images/vendors/Urban_Tray.jpeg',
    areaServed: ['All'],
    buildingServed: ['All']
  }
];
