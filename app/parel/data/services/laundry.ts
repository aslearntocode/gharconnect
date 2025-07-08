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
  areaServed?: string;
  buildingServed?: string;
}

export const vendors: Vendor[] = [
  {
    name: 'Jays Laundry',
    services: [{
      name: 'Steam Iron',
      description: 'Clothes washed, ironed and folded',
      price: '₹99',
      unit: 'kg'
    }],
    mobile: '+91 9892826805',
    areaServed: 'All',
    buildingServed: 'All'
  },
  {
    name: 'Vijay',
    services: [{
      name: 'Wash & Fold',
      description: 'Clothes washed, ironed and folded',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 7710940252',
    areaServed: 'Parel',
    buildingServed: 'L&T Crescent Bay'
  },
  {
    name: 'Santosh',
    services: [{
      name: 'Wash & Fold',
      description: 'Clothes washed, ironed and folded',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 96511 43603',
    areaServed: 'Parel',
    buildingServed: 'L&T Crescent Bay'
  },
  {
    name: 'Sukhmilal Rajak',
    services: [{
      name: 'Wash & Fold',
      description: 'Clothes washed, ironed and folded',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 93243 26757',
    areaServed: 'Parel',
    buildingServed: 'L&T Crescent Bay'
  },
  {
    name: 'Rakesh',
    services: [{
      name: 'Wash & Fold',
      description: 'Clothes washed, ironed and folded',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 90041 93870',
    areaServed: 'Parel',
    buildingServed: 'L&T Crescent Bay'
  },
  {
    name: 'Washart Drycleaners',
    services: [{
      name: 'Dryclean & Steam Press',
      description: 'Dryclean & Steam Press',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 98670 69459',
    areaServed: 'All',
    buildingServed: 'All'
  },
  {
    name: 'Bubble Drycleaning',
    services: [{
      name: 'Dryclean & Steam Press',
      description: 'Dryclean & Steam Press',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 98670 52464',
    areaServed: 'All',
    buildingServed: 'All'
  }
]; 