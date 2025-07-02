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
  photos: string[];
  social_media: string;
}

export const vendors: Vendor[] = [
  {
    name: 'Padma Yoga',
    products: [{
      name: 'Yoga Class',
      description: 'Yoga Individual and Group Classes for all levels',
      price: 'Call for price',
      unit: 'session'
    }],
    mobile: '+91 9833564799',
    photos: [
      '/images/vendors/Padma_Yoga1.jpeg',
      '/images/vendors/Padma_Yoga2.jpeg'
    ],
    social_media: ''
  }
]; 