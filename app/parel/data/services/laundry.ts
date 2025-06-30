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
    name: 'Jays Laundry',
    services: [{
      name: 'Steam Iron',
      description: 'Clothes washed, ironed and folded',
      price: '₹99',
      unit: 'kg'
    }],
    mobile: '+91 9892826805'
  },
  {
    name: 'Vijay',
    services: [{
      name: 'Wash & Fold',
      description: 'Clothes washed, ironed and folded',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 7710940252'
  },
  {
    name: 'Santosh',
    services: [{
      name: 'Wash & Fold',
      description: 'Clothes washed, ironed and folded',
      price: 'Call for price',
      unit: 'kg'
    }],
    mobile: '+91 9651143603'
  },
  {
    name: 'Sukhmilal Rajak',
    services: [{
      name: 'Wash & Fold',
      description: 'Clothes washed, ironed and folded',
      price: 'Call for price',
      unit: 'kg'
    }],
  mobile: '+91 9324326757'
},
{
  name: 'Rakesh',
  services: [{
    name: 'Wash & Fold',
    description: 'Clothes washed, ironed and folded',
    price: 'Call for price',
    unit: 'kg'
  }],
  mobile: '+91 90041 93870'
},
{
  name: 'Washart Drycleaners',
  services: [{
    name: 'Dryclean & Steam Press',
    description: 'Dryclean & Steam Press',
    price: 'Call for price',
    unit: 'kg'
  }],
  mobile: '+91 98670 69459'
}
]; 