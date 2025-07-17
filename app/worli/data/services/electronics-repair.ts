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
    name: 'TechCare Electronics',
    services: [{
      name: 'Mobile Repair',
      description: 'Screen replacement, battery, charging port',
      price: '₹500',
      unit: 'per repair'
    }],
    mobile: '+91 98765 43210',
    areaServed: [],
    buildingServed: []
  },
  {
    name: 'QuickFix Solutions',
    services: [{
      name: 'Laptop Repair',
      description: 'Hardware issues, software problems, virus removal',
      price: 'Call for price',
      unit: 'per repair'
    }],
    mobile: '+91 87654 32109',
    areaServed: [],
    buildingServed: []
  },
  {
    name: 'Vishnu Bajaj',
    services: [{
      name: 'Electronics Repair',
      description: 'Oven, gas stove, etc. repair',
      price: 'Call for price',
      unit: 'per repair'
    }],
    mobile: '+91 83694 75836',
    areaServed: ['All'],
    buildingServed: ['All']
  }
]; 