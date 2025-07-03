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
    mobile: '+91 9876543211',
    photo: '/images/services/art-class.jpg'
  },
  {
    name: 'Worli Music School',
    services: [{
      name: 'Music Classes',
      description: 'Fun music lessons for children - piano, guitar, vocals',
      price: '₹1800',
      unit: 'per month'
    }],
    mobile: '+91 8765432110',
    photo: '/images/services/music-class.jpg'
  },
  {
    name: 'Worli Sports Academy',
    services: [{
      name: 'Sports Coaching',
      description: 'Sports coaching and fitness for kids - cricket, football, swimming',
      price: '₹2200',
      unit: 'per month'
    }],
    mobile: '+91 7654321109',
    photo: '/images/services/sports-class.jpg'
  },
  {
    name: 'Rushi Kapadia - State Level Tennis Player',
    services: [{
      name: 'Table Tennis Classes',
      description: 'Table Tennis classes for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 9819735090'
  },
  {
    name: 'Sushil - Taekwondo Player',
    services: [{
      name: 'Taekwondo Classes',
      description: 'Taekwondo classes for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 85918 61692'
  },
  {
    name: 'Bhaviraj House of Music',
    services: [{
      name: 'Music Lessons',
      description: 'Music lessons for children including singing, piano, guitar, etc.',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 90825 03460'
  }
]; 