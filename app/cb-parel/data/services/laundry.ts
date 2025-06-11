export interface LaundryService {
  id: string;
  name: string;
  description: string;
  services: {
    type: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'washing' | 'dry-cleaning' | 'ironing' | 'other';
  brand: string;
  inStock: boolean;
}

export const laundryServices: LaundryService[] = [
  {
    id: 'wash-1',
    name: 'Regular Washing',
    description: 'Professional washing service for regular clothes',
    services: [
      { type: 'Regular Clothes', price: 2.99, unit: 'kg' },
      { type: 'Delicate Clothes', price: 4.99, unit: 'kg' },
      { type: 'Heavy Clothes', price: 3.99, unit: 'kg' }
    ],
    image: '/images/services/laundry-wash.jpg',
    category: 'washing',
    brand: 'Clean & Fresh',
    inStock: true
  },
  {
    id: 'dry-1',
    name: 'Dry Cleaning',
    description: 'Professional dry cleaning for delicate items',
    services: [
      { type: 'Shirts', price: 3.99, unit: 'piece' },
      { type: 'Suits', price: 12.99, unit: 'piece' },
      { type: 'Dresses', price: 8.99, unit: 'piece' }
    ],
    image: '/images/services/dry-cleaning.jpg',
    category: 'dry-cleaning',
    brand: 'Clean & Fresh',
    inStock: true
  },
  {
    id: 'iron-1',
    name: 'Ironing Service',
    description: 'Professional ironing and pressing service',
    services: [
      { type: 'Shirts', price: 1.99, unit: 'piece' },
      { type: 'Pants', price: 2.49, unit: 'piece' },
      { type: 'Bulk Items', price: 1.49, unit: 'piece' }
    ],
    image: '/images/services/ironing.jpg',
    category: 'ironing',
    brand: 'Clean & Fresh',
    inStock: true
  },
  {
    id: 'wash-2',
    name: 'Premium Washing',
    description: 'Premium washing service with special care',
    services: [
      { type: 'Premium Clothes', price: 5.99, unit: 'kg' },
      { type: 'Baby Clothes', price: 4.99, unit: 'kg' },
      { type: 'Sports Wear', price: 3.99, unit: 'kg' }
    ],
    image: '/images/services/premium-wash.jpg',
    category: 'washing',
    brand: 'Laundry Pro',
    inStock: true
  },
  {
    id: 'dry-2',
    name: 'Express Dry Cleaning',
    description: 'Quick dry cleaning service',
    services: [
      { type: 'Express Shirts', price: 5.99, unit: 'piece' },
      { type: 'Express Suits', price: 15.99, unit: 'piece' },
      { type: 'Express Dresses', price: 10.99, unit: 'piece' }
    ],
    image: '/images/services/express-dry.jpg',
    category: 'dry-cleaning',
    brand: 'Laundry Pro',
    inStock: true
  },
  {
    id: 'iron-2',
    name: 'Premium Ironing',
    description: 'Premium ironing with special attention to detail',
    services: [
      { type: 'Premium Shirts', price: 2.99, unit: 'piece' },
      { type: 'Premium Pants', price: 3.49, unit: 'piece' },
      { type: 'Premium Bulk', price: 2.49, unit: 'piece' }
    ],
    image: '/images/services/premium-iron.jpg',
    category: 'ironing',
    brand: 'Laundry Pro',
    inStock: true
  }
]; 