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
      name: 'Kajal Flowers',
      products: [{
        name: 'Fresh Flowers',
        description: 'Fresh flowers delivered daily',
        price: 'Call for price',
        unit: 'piece'
      }],
      mobile: '+91 88982 93935 / 98200 43803',
      areaServed: ['All'],
      buildingServed: ['All']
    },
    {
      name: 'Petals',
      products: [{
        name: 'Fresh Flowers',
        description: 'Fresh flowers delivered daily',
        price: 'Call for price',
        unit: 'piece'
      }],
      mobile: '+91 93245 44858',
      areaServed: ['All'],
      buildingServed: ['All']
    }
  ]; 