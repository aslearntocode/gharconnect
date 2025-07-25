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
  areaServed?: string[];
  buildingServed?: string[];
}

export const vendors: Vendor[] = [
  {
    name: 'Brijesh Joshi - Music Classes',
    services: [{
      name: 'Guitar Classes',
      description: 'Guitar lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 73583 65827',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Rajesh - Guitar Lessons',
    services: [{
      name: 'Guitar Lessons',
      description: 'Guitar lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 99676 55503',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Bhaviraj House of Music',
    services: [{
      name: 'Music Lessons',
      description: 'Music lessons for children including singing, piano, guitar, etc.',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 90825 03460',
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    name: 'Debashree - Hindustani Vocal Classical',
    services: [{
      name: 'Vocal Classes',
      description: 'Vocal lessons for children and adults',
      price: 'Call for price',
      unit: 'per class'
    }],
    mobile: '+91 70451 66087',
    areaServed: ['Parel'],
    buildingServed: ['All']
  },
  {
    name: 'Damini - Western Vocal',
    services: [{
      name: 'Western Vocal Classes',
      description: 'Vocal training and singing lessons for all ages',
      price: 'Call for price',
      unit: 'per class'
    }],
    mobile: '+91 99306 44409',
    areaServed: ['Parel'],
    buildingServed: ['All']
  },
  {
    name: 'Dr. Raman - Namo Music Academy',
    services: [{
      name: 'Music Classes',
      description: 'Music lessons for children and adults',
      price: 'Call for price',
      unit: 'per class'
    }],
    mobile: '+91 93237 87555',
    areaServed: ['Parel'],
    buildingServed: ['All']
  },
  {
    name: 'Shagota - Music Academy',
    services: [{
      name: 'Music Classes',
      description: 'Music lessons for children and adults',
      price: 'Call for price',
      unit: 'per class'
    }],
    mobile: '+91 99305 30735',
    areaServed: ['Parel'],
    buildingServed: ['All']
  },
  {
    name: 'Tiya Sonigara - Dance Classes',
    services: [{
      name: 'Dance Classes',
      description: 'Group Dance Classes for children',
      price: 'Call for price',
      unit: 'per class'
    }],
    mobile: '+91 91379 17588',
    areaServed: ['Parel'],
    buildingServed: ['All']
  },
];
