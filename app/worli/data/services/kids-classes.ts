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
    name: 'Worli Art Academy',
    services: [{
      name: 'Art Classes',
      description: 'Creative art classes for kids of all ages',
      price: '₹1500',
      unit: 'per month'
    }],
    mobile: '+91 98765 43211',
    photo: '/images/services/art-class.jpg',
    areaServed: [],
    buildingServed: []
  },
  {
    name: 'Worli Music School',
    services: [{
      name: 'Music Classes',
      description: 'Fun music lessons for children - piano, guitar, vocals',
      price: '₹1800',
      unit: 'per month'
    }],
    mobile: '+91 87654 32110',
    photo: '/images/services/music-class.jpg',
    areaServed: [],
    buildingServed: []
  },
  {
    name: 'Worli Sports Academy',
    services: [{
      name: 'Sports Coaching',
      description: 'Sports coaching and fitness for kids - cricket, football, swimming',
      price: '₹2200',
      unit: 'per month'
    }],
    mobile: '+91 76543 21109',
    photo: '/images/services/sports-class.jpg',
    areaServed: [],
    buildingServed: []
  },
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