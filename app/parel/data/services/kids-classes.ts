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
    name: 'Kahoo Kids, Matunga',
    services: [{
      name: 'Art Classes',
      description: 'Creative art classes for kids of all ages',
      price: '₹600-₹900',
      unit: 'per class'
    }],
    mobile: '+91 ',
    photo: '/images/services/art-class.jpg'
  },
  {
    name: 'Brijesh Joshi',
    services: [{
      name: 'Music Classes',
      description: 'Guitar lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 7358365827',
    photo: '/images/services/music-class.jpg'
  },
  {
    name: 'Rajesh',
    services: [{
      name: 'Sports Coaching',
      description: 'Guitar lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 9967655503',
    photo: '/images/services/sports-class.jpg'
  },
  {
    name: 'Noel',
    services: [{
      name: 'Swimming Coaching',
      description: 'Swimming lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 7900084119',
    photo: '/images/services/sports-class.jpg'
  },
  {
    name: 'Hetal Paleja',
    services: [{
      name: 'Swimming Coaching',
      description: 'Swimming lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 8879813233',
    photo: '/images/services/sports-class.jpg'
  }
]; 