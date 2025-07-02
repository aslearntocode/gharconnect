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
  social_media: string;
}

export const vendors: Vendor[] = [
  {
    name: 'Subodh Pednekar',
    products: [{
      name: 'Personal Training',
      description: 'Personal Training using Resistance Bands with No Equipment',
      price: 'Call for price',
      unit: 'session'
    }],
    mobile: '+91 9920458339',
    photo: '/images/vendors/Subodh_PT.jpeg',
    social_media: ''
  },
  {
    name: 'Ashok',
    products: [{
      name: 'Personal Training',
      description: 'Personal Training Indoor and Outdoor',
      price: 'Call for price',
      unit: 'session'
    }],
    mobile: '+91 9820886804',
    photo: '/images/vendors/Ashok_PT.jpeg',
    social_media: ''
  }
];