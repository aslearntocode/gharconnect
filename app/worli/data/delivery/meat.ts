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
  photo: string;
}

export interface MeatProduct {
  id: string;
  name: string;
  description: string;
  sizes: {
    size: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'chicken' | 'mutton' | 'pork' | 'beef' | 'other';
  brand: string;
  inStock: boolean;
}

export const vendors: Vendor[] = [
  {
    name: 'Fresh To Home',
    products: [{
      name: 'Meat',
      description: 'Fresh meat - chicken, mutton, and pork available',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 90000 00002',
    photo: ''
  },
  {
    name: 'Figo Fresh Meat',
    products: [{
      name: 'Meat',
      description: 'Fresh meat - chicken, mutton and eggs available',
      price: 'Image Attached',
      unit: 'per kg'
    }],
    mobile: '+91 98679 72116',
    photo: '/images/vendors/Figo_Fresh_Meat.jpeg'
  }
];


