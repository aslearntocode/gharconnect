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
    name: 'Jeetu Painting',
    services: [{
      name: 'Interior Painting',
      description: 'Interior painting for flats',
      price: 'Call for price',
      unit: 'flat'
    }],
    mobile: '+91 99303 97796',
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    name: 'Shoeb',
    services: [{
      name: 'Painting',
      description: 'All types of painting work',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 91672 28070',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay','Ashok Tower','Ashok Garden']
  }
]; 