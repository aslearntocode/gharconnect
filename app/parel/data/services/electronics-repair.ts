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
    name: 'Mangilal',
    services: [{
      name: 'Electronics Repair',
      description: 'refrigerator, Washing Machine etc. repair',
      price: 'Call for price',
      unit: 'per repair'
    }],
    mobile: '+91 9892660223',
    areaServed: [],
    buildingServed: []
  },
  {
    name: 'Dayanand',
    services: [{
      name: 'Electronics Repair',
      description: 'Fan, Geyser, Grinder etc. repair',
      price: 'Call for price',
      unit: 'per repair'
    }],
    mobile: '+91 79777 74528',
    areaServed: [],
    buildingServed: []
  }
];
