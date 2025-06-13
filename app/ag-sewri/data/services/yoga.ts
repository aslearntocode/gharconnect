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

export const vendors: Vendor[] = [
  {
    name: 'Padma Yoga', // Replace with the actual name
    products: [{
      name: 'Yoga Class', // Replace with the actual product/service name
      description: 'Yoga Individual and Group Classes for all levels', // Replace with actual description
      price: 'Call for price', // Or a number if you have a fixed price
      unit: 'session' // Or 'class', etc.
    }],
    mobile: '+91 9833564799', // Replace with the actual mobile number
    photo: '/images/vendors/yoga-vendor.jpg' // Replace with the actual photo path
  }
]; 