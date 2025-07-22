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
  photo?: string;
  areaServed?: string[];
  buildingServed?: string[];
}

export const vendors: Vendor[] = [
  {
    name: 'Mitrasen Pharmacy',
    services: [{
      name: 'General Medicines',
      description: 'All types of medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 73049 70351',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Shraddha medical and General Store',
    services: [{
      name: 'Prescription Medicines',
      description: 'All prescription medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 77382 27893',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Wellness Forever - Parel',
    services: [{
      name: 'OTC Medicines',
      description: 'Over the counter medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 93267 13512',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Ganpati Medicals',
    services: [{
      name: 'OTC Medicines',
      description: 'Over the counter medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 84339 95732',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  },
  {
    name: 'Swastik Medical',
    services: [{
      name: 'OTC Medicines',
      description: 'Over the counter medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 77389 15300',
    areaServed: ['Parel'],
    buildingServed: ['L&T Crescent Bay']
  }
]; 