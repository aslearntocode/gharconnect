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
    name: 'Handy Carpentry',
    services: [{
      name: 'Furniture Repair',
      description: 'Repair of wooden furniture',
      price: 300,
      unit: 'job'
    }],
    mobile: '+91 90000 00006'
  }
];

export interface CarpenterService {
  id: string;
  name: string;
  description: string;
  services: {
    type: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'furniture' | 'repair' | 'installation' | 'other';
  brand: string;
  inStock: boolean;
}

export const carpenterServices: CarpenterService[] = [
  {
    id: 'furniture-1',
    name: 'Furniture Assembly',
    description: 'Professional furniture assembly service',
    services: [
      { type: 'Small Furniture', price: 29.99, unit: 'piece' },
      { type: 'Medium Furniture', price: 49.99, unit: 'piece' },
      { type: 'Large Furniture', price: 79.99, unit: 'piece' }
    ],
    image: '/images/services/furniture-assembly.jpg',
    category: 'furniture',
    brand: 'Wood Works',
    inStock: true
  },
  {
    id: 'repair-1',
    name: 'Furniture Repair',
    description: 'Expert furniture repair and restoration',
    services: [
      { type: 'Minor Repairs', price: 39.99, unit: 'hour' },
      { type: 'Major Repairs', price: 69.99, unit: 'hour' },
      { type: 'Restoration', price: 99.99, unit: 'hour' }
    ],
    image: '/images/services/furniture-repair.jpg',
    category: 'repair',
    brand: 'Wood Works',
    inStock: true
  },
  {
    id: 'install-1',
    name: 'Cabinet Installation',
    description: 'Professional cabinet installation service',
    services: [
      { type: 'Small Cabinet', price: 89.99, unit: 'piece' },
      { type: 'Medium Cabinet', price: 149.99, unit: 'piece' },
      { type: 'Large Cabinet', price: 249.99, unit: 'piece' }
    ],
    image: '/images/services/cabinet-install.jpg',
    category: 'installation',
    brand: 'Wood Works',
    inStock: true
  },
  {
    id: 'furniture-2',
    name: 'Custom Furniture',
    description: 'Custom furniture design and creation',
    services: [
      { type: 'Small Custom', price: 199.99, unit: 'piece' },
      { type: 'Medium Custom', price: 399.99, unit: 'piece' },
      { type: 'Large Custom', price: 699.99, unit: 'piece' }
    ],
    image: '/images/services/custom-furniture.jpg',
    category: 'furniture',
    brand: 'Craft Masters',
    inStock: true
  },
  {
    id: 'repair-2',
    name: 'Wood Flooring',
    description: 'Wood flooring installation and repair',
    services: [
      { type: 'Floor Repair', price: 49.99, unit: 'sqft' },
      { type: 'Floor Installation', price: 89.99, unit: 'sqft' },
      { type: 'Floor Refinishing', price: 69.99, unit: 'sqft' }
    ],
    image: '/images/services/wood-flooring.jpg',
    category: 'repair',
    brand: 'Craft Masters',
    inStock: true
  },
  {
    id: 'install-2',
    name: 'Door Installation',
    description: 'Professional door installation service',
    services: [
      { type: 'Interior Door', price: 79.99, unit: 'piece' },
      { type: 'Exterior Door', price: 149.99, unit: 'piece' },
      { type: 'Sliding Door', price: 199.99, unit: 'piece' }
    ],
    image: '/images/services/door-install.jpg',
    category: 'installation',
    brand: 'Craft Masters',
    inStock: true
  }
]; 