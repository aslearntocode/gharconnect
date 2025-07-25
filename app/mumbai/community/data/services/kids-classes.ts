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
    name: 'Noel - Swimming Coach',
    services: [{
      name: 'Swimming Coaching',
      description: 'Swimming lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 79000 84119',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Hetal Paleja - Swimming Coach',
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
    name: 'Hemini Lakdawala - Speech & Drama',
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
    name: 'Sonesh Sir - Basketball Coach',
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
    name: 'Rushi Kapadia - State Level TT Player',
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
    name: 'Ranjeet Tambe - Swimming Coach',
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
    name: 'Shailesh Badminton Coach',
    services: [{
      name: 'Badminton Coaching',
      description: 'Badminton coaching for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 86521 11423',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Siddharth Badminton Coach',
    services: [{
      name: 'Badminton Coaching',
      description: 'Badminton coaching for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 99673 51381',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Dilip - Chess Coach',
    services: [{
      name: 'Chess Coaching',
      description: 'Chess coaching for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 97691 13120',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Laksh - Chess Coach',
    services: [{
      name: 'Chess Coaching',
      description: 'Chess coaching for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 98674 42247',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Irfan - Skating Coach',
    services: [{
      name: 'Chess Coaching',
      description: 'Chess coaching for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 81498 17757',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  }
]; 