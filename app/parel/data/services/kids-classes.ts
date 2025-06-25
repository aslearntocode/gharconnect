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
    mobile: '+91 '
  },
  {
    name: 'Brijesh Joshi',
    services: [{
      name: 'Music Classes',
      description: 'Guitar lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 73583 65827'
  },
  {
    name: 'Rajesh',
    services: [{
      name: 'Sports Coaching',
      description: 'Guitar lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 99676 55503'
  },
  {
    name: 'Noel',
    services: [{
      name: 'Swimming Coaching',
      description: 'Swimming lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 79000 84119'
  },
  {
    name: 'Hetal Paleja',
    services: [{
      name: 'Swimming Coaching',
      description: 'Swimming lessons for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 88798 13233'
  },
  {
    name: 'Hemini Lakdawala',
    services: [{
      name: 'Speech & Drama',
      description: 'Speech & Drama classes for children. Affiliated to Trinity College London',
      price: 'Call for price',
      unit: 'per class'
    }],
    mobile: '+91 93242 60874'
  },
  {
    name: 'Sonesh Sir',
    services: [{
      name: 'Basketball Classes',
      description: 'Basketball classes for children',
      price: '₹3500/2500',
      unit: 'per month'
    }],
    mobile: '+91 91671 79484'
  },
  {
    name: 'Rushi Kapadia - State Level Player',
    services: [{
      name: 'Table Tennis Classes',
      description: 'Table Tennis classes for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 98197 35090'
  },
  {
    name: 'Ranjit',
    services: [{
      name: 'Swimming Classes',
      description: 'Swimming classes for children and adults',
      price: 'Call for price',
      unit: 'per month'
    }],
    mobile: '+91 98707 96928'
  }
]; 