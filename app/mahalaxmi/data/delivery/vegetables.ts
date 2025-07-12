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
    name: 'Riddhi Siddhi',
    products: [{
      name: 'Tomatoes',
      description: 'Farm vegetables at T5-P5',
      price: "Call for price",
      unit: 'gms'
    }],
    mobile: '+91 7977541807 / 9140929550'
  }
]; 