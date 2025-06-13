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

export interface FruitProduct {
  id: string;
  name: string;
  description: string;
  sizes: {
    size: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'citrus' | 'tropical' | 'berries' | 'stone' | 'other';
  brand: string;
  inStock: boolean;
}

export const vendors: Vendor[] = [
  {
    name: 'Nadeem (Mangoes)',
    products: [{
      name: 'Alphonso Mangoes',
      description: 'Premium quality Alphonso mangoes',
      price: 'Call for price',
      unit: 'dozen'
    }],
    mobile: '+91 87959 49683'
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
    name: 'Kriya Organics',
    products: [{
      name: 'Fruits',
      description: 'Fruits',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 9987066551 / 9004336536'
  }
]; 