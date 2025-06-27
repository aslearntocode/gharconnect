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
    name: 'Riddhi Siddhi',
    products: [{
      name: 'Tomatoes',
      description: 'Farm vegetables at T5-P5',
      price: "Call for price",
      unit: 'gms'
    }],
    mobile: '+91 7977541807 / 9140929550',
    // photo: '/images/vendors/Riddhi_Siddhi.jpeg'
  },
  {
    name: 'Krishna Gupta Groceries',
    products: [{
      name: 'Tomatoes',
      description: 'Farm fresh vegetables',
      price: "Call for price",
      unit: 'gms'
    }],
    mobile: '+91 93219 80577 / 90826 03974',
    photo: '/images/vendors/Krishna_Grocery.jpeg'
  }
]; 