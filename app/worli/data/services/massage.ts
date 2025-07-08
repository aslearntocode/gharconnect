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
    name: 'Wellness Spa Worli',
    services: [{
      name: 'Swedish Massage',
      description: 'Relaxing full body massage with therapeutic oils',
      price: '₹1800',
      unit: 'hour'
    }],
    mobile: '+91 9876543210',
    areaServed: ['Worli'],
    buildingServed: ['All Buildings']
  }
];
