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
    name: 'Munna Electrician',
    services: [{
      name: 'Electrical Work',
      description: 'All types of electrical work',
      price: 'Call for price',
      unit: 'job'
    }],
    mobile: '+91 9653303552',
    areaServed: 'Parel',
    buildingServed: 'L&T Crescent Bay'
  }
]; 