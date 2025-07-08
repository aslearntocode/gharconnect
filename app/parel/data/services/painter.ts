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
  }
]; 