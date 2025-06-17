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
  }
]; 