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
  }
]; 