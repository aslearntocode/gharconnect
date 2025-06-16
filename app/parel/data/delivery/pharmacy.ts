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
    name: 'Mitrasen Pharmacy',
    services: [{
      name: 'General Medicines',
      description: 'All types of medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 7304970351'
  },
  {
    name: 'Shraddha medical and General Store',
    services: [{
      name: 'Prescription Medicines',
      description: 'All prescription medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 7738227893'
  },
  {
    name: 'Wellness Forever',
    services: [{
      name: 'OTC Medicines',
      description: 'Over the counter medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 9326713512'
  },
  {
    name: 'Ganpati Medicals',
    services: [{
      name: 'OTC Medicines',
      description: 'Over the counter medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 8433995732'
  }
]; 