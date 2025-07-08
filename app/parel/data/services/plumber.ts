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
    name: 'Ajay Contractor',
    services: [{
      name: 'Plumbing',
      description: 'Fixing water leaks and other plumbing issues',
      price: 200,
      unit: 'job'
    }],
    mobile: '+91 7208308380',
    areaServed: '',
    buildingServed: ''
  },
  {
    name: 'Raju B Mistry',
    services: [{
      name: 'Plumbing',
      description: 'Speacialist in Civil & Interior Design etc.',
      price: 200,
      unit: 'job'
    }],
    mobile: '+91 9326396748',
    areaServed: '',
    buildingServed: ''
  }
]; 