export interface Service {
  name: string;
  description: string;
  price: number | string;
  unit: string;
}

export interface Vendor {
  name: string;
  services: Service[];
  mobile: string;
  social_media?: string;
  areaServed?: string[];
  buildingServed?: string[];
}

export const vendors: Vendor[] = [
  {
    name: 'Prakash Scrap Dealer',
    services: [{
      name: 'Newspaper Scrap',
      description: 'Newspapers, magazines, cardboard boxes',
      price: '₹8-12',
      unit: 'kg'
    }],
    mobile: '+91 90044 56294',
    social_media: '',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Shubham Scrap Dealer',
    services: [{
      name: 'Newspaper Scrap',
      description: 'Newspapers, magazines, cardboard boxes',
      price: '₹8-12',
      unit: 'kg'
    }],
    mobile: '+91 70453 78869',
    social_media: '',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Jayantilal Scrap Dealer',
    services: [{
      name: 'Newspaper Scrap',
      description: 'Newspapers, magazines, cardboard boxes',
      price: '₹8-12',
      unit: 'kg'
    }],
    mobile: '+91 97730 47179',
    social_media: '',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Kamal Scrap Dealer',
    services: [{
      name: 'Newspaper Scrap',
      description: 'Newspapers, magazines, cardboard boxes',
      price: '₹8-12',
      unit: 'kg'
    }],
    mobile: '+91 98194 26119',
    social_media: '',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  }
];
