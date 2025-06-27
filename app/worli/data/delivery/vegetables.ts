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
}

export const vendors: Vendor[] = [
  {
    name: 'Veggie Basket',
    products: [{
      name: 'Tomatoes',
      description: 'Farm fresh tomatoes',
      price: 40,
      unit: 'kg'
    }],
    mobile: '+91 90000 00003'
  }
]; 