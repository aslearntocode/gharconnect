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
    name: 'TechCare Electronics',
    services: [{
      name: 'Mobile Repair',
      description: 'Screen replacement, battery, charging port',
      price: '₹500',
      unit: 'per repair'
    }],
    mobile: '+91 9876543210'
  },
  {
    name: 'QuickFix Solutions',
    services: [{
      name: 'Laptop Repair',
      description: 'Hardware issues, software problems, virus removal',
      price: 'Call for price',
      unit: 'per repair'
    }],
    mobile: '+91 8765432109'
  },
  {
    name: 'SmartPhone Doctor',
    services: [{
      name: 'Smartphone Services',
      description: 'All types of mobile repairs and maintenance',
      price: '₹300',
      unit: 'per service'
    }],
    mobile: '+91 7654321098'
  },
  {
    name: 'Electronics Hub',
    services: [{
      name: 'General Electronics',
      description: 'TV, AC, refrigerator and other appliance repairs',
      price: 'Call for price',
      unit: 'per repair'
    }],
    mobile: '+91 6543210987'
  }
]; 