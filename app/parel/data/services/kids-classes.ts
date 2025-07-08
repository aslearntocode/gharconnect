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
    name: 'Kahoo Kids, Matunga',
    services: [{
      name: 'Art Classes',
      description: 'Creative art classes for kids of all ages',
      price: '₹600-₹900',
      unit: 'per class'
    }],
    mobile: '+91 ',
    areaServed: ['South Bombay'],
    buildingServed: ['All']
  },
  {
    name: 'Brijesh Joshi',
    services: [{
      name: 'Music Classes',
      description: 'Guitar lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 73583 65827',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Rajesh',
    services: [{
      name: 'Sports Coaching',
      description: 'Guitar lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 99676 55503',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Noel',
    services: [{
      name: 'Swimming Coaching',
      description: 'Swimming lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 79000 84119',
    areaServed: 'Parel',
    buildingServed: 'L&T Crescent Bay'
  },
  {
    name: 'Hetal Paleja',
    services: [{
      name: 'Swimming Coaching',
      description: 'Swimming lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 88798 13233',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Hemini Lakdawala',
    services: [{
      name: 'Speech & Drama',
      description: 'Speech & Drama classes for children. Affiliated to Trinity College London',
      price: 'Call for price',
      unit: 'per class'
    }],
    mobile: '+91 93242 60874',
    areaServed: ['South Bombay'],
    buildingServed: ['All']
  },
  {
    name: 'Sonesh Sir',
    services: [{
      name: 'Basketball Classes',
      description: 'Basketball classes for children',
      price: '₹3500/2500',
      unit: 'per month'
    }],
    mobile: '+91 91671 79484',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Rushi Kapadia - State Level Player',
    services: [{
      name: 'Table Tennis Classes',
      description: 'Table Tennis classes for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 98197 35090',
    areaServed: ['South Bombay'],
    buildingServed: ['All']
  },
  {
    name: 'Ranjeet Tambe',
    services: [{
      name: 'Swimming Classes',
      description: 'Swimming classes for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 98707 96928',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay','Ashok Gardens']
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
    areaServed: ['South Bombay'],
    buildingServed: ['All']
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
    name: 'Siddharth',
    services: [{
      name: 'Badminton Coaching',
      description: 'Badminton lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 99673 51381',
    areaServed: ['South Bombay'],
    buildingServed: ['All']
  }
]; 