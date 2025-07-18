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
  photo?: string;
  areaServed?: string[];
  buildingServed?: string[];
}

export const vendors: Vendor[] = [
  {
    name: 'Rushi Kapadia - State Level Tennis Player',
    services: [{
      name: 'Table Tennis Classes',
      description: 'Table Tennis classes for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 98197 35090',
    areaServed: [],
    buildingServed: []
  },
  {
    name: 'Sushil - Taekwondo Player',
    services: [{
      name: 'Taekwondo Classes',
      description: 'Taekwondo classes for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 85918 61692',
    areaServed: [],
    buildingServed: []
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
    areaServed: [],
    buildingServed: []
  }
]; 