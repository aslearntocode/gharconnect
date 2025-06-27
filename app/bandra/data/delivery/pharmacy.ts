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
    name: 'Wellness Forever',
    services: [{
      name: 'OTC Medicines',
      description: 'Over the counter medicines available',
      price: 'MRP',
      unit: 'per item'
    }],
    mobile: '+91 9326713512'
  }
]; 