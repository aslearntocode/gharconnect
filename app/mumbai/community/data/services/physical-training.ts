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
  social_media?: string;
  areaServed?: string[];
  buildingServed?: string[];
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
    mobile: '+91 99204 58339',
    photo: '/images/vendors/Subodh_PT.jpeg',
    social_media: '',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Ashok',
    products: [{
      name: 'Personal Training',
      description: 'Personal Training Indoor and Outdoor',
      price: 'Call for price',
      unit: 'session'
    }],
    mobile: '+91 98208 86804',
    photo: '',
    social_media: '',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Chanchal',
    products: [{
      name: 'Personal Training',
      description: 'Personal Training Indoor and Outdoor',
      price: 'Call for price',
      unit: 'session'
    }],
    mobile: '+91 97690 61443',
    photo: '/images/vendors/Chanchal.jpeg',
    social_media: 'https://www.instagram.com/share/BBXf-y3bQP',
    areaServed: ['All'],
    buildingServed: ['All']
  }
];