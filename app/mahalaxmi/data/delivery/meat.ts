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
      description: 'Fresh meat - chicken, mutton and pork available',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 90000 00002'
  }
];

