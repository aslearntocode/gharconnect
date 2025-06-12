export interface Product {
  name: string;
  description: string;
  price: number | string;
  unit: string;
}

export interface Vendor {
  name: string;
  products: Product[];
  mobile: string;
}

export const vendors: Vendor[] = [
  {
    name: 'Dairy Fresh',
    products: [{
      name: 'Cow Milk',
      description: 'Fresh cow milk delivered daily',
      price: 60,
      unit: 'litre'
    }],
    mobile: '+91 90000 00001'
  }
];

export interface DairyProduct {
  id: string;
  name: string;
  description: string;
  sizes: {
    size: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'milk' | 'cheese' | 'butter' | 'yogurt' | 'cream' | 'other';
  brand: string;
  inStock: boolean;
}

export const dairyProducts: DairyProduct[] = [
  {
    id: 'milk-1',
    name: 'Fresh Whole Milk',
    description: 'Pure and fresh whole milk from grass-fed cows',
    sizes: [
      { size: '500ml', price: 1.99, unit: 'bottle' },
      { size: '1L', price: 3.49, unit: 'bottle' },
      { size: '2L', price: 6.49, unit: 'bottle' }
    ],
    image: '/images/dairy/milk.jpg',
    category: 'milk',
    brand: 'Amul',
    inStock: true
  },
  {
    id: 'cheese-1',
    name: 'Cheddar Cheese',
    description: 'Aged cheddar cheese with rich flavor',
    sizes: [
      { size: '200g', price: 4.99, unit: 'pack' },
      { size: '500g', price: 11.99, unit: 'pack' },
      { size: '1kg', price: 22.99, unit: 'pack' }
    ],
    image: '/images/dairy/cheddar.jpg',
    category: 'cheese',
    brand: 'Amul',
    inStock: true
  },
  {
    id: 'butter-1',
    name: 'Unsalted Butter',
    description: 'Pure creamery butter made from fresh cream',
    sizes: [
      { size: '100g', price: 2.99, unit: 'pack' },
      { size: '250g', price: 6.99, unit: 'pack' },
      { size: '500g', price: 12.99, unit: 'pack' }
    ],
    image: '/images/dairy/butter.jpg',
    category: 'butter',
    brand: 'Amul',
    inStock: true
  },
  {
    id: 'yogurt-1',
    name: 'Greek Yogurt',
    description: 'Thick and creamy Greek-style yogurt',
    sizes: [
      { size: '200g', price: 2.49, unit: 'cup' },
      { size: '500g', price: 5.49, unit: 'tub' },
      { size: '1kg', price: 9.99, unit: 'tub' }
    ],
    image: '/images/dairy/yogurt.jpg',
    category: 'yogurt',
    brand: 'Amul',
    inStock: true
  },
  {
    id: 'milk-2',
    name: 'Organic Whole Milk',
    description: 'Certified organic whole milk from free-range cows',
    sizes: [
      { size: '500ml', price: 2.49, unit: 'bottle' },
      { size: '1L', price: 4.49, unit: 'bottle' },
      { size: '2L', price: 8.49, unit: 'bottle' }
    ],
    image: '/images/dairy/organic-milk.jpg',
    category: 'milk',
    brand: 'Mother Dairy',
    inStock: true
  },
  {
    id: 'cheese-2',
    name: 'Mozzarella Cheese',
    description: 'Fresh mozzarella cheese perfect for pizza',
    sizes: [
      { size: '200g', price: 5.99, unit: 'pack' },
      { size: '500g', price: 13.99, unit: 'pack' },
      { size: '1kg', price: 25.99, unit: 'pack' }
    ],
    image: '/images/dairy/mozzarella.jpg',
    category: 'cheese',
    brand: 'Mother Dairy',
    inStock: true
  },
  {
    id: 'butter-2',
    name: 'Salted Butter',
    description: 'Creamy salted butter for cooking and baking',
    sizes: [
      { size: '100g', price: 2.99, unit: 'pack' },
      { size: '250g', price: 6.99, unit: 'pack' },
      { size: '500g', price: 12.99, unit: 'pack' }
    ],
    image: '/images/dairy/salted-butter.jpg',
    category: 'butter',
    brand: 'Mother Dairy',
    inStock: true
  },
  {
    id: 'yogurt-2',
    name: 'Fruit Yogurt',
    description: 'Creamy yogurt with real fruit pieces',
    sizes: [
      { size: '100g', price: 1.99, unit: 'cup' },
      { size: '400g', price: 6.99, unit: 'tub' },
      { size: '1kg', price: 14.99, unit: 'tub' }
    ],
    image: '/images/dairy/fruit-yogurt.jpg',
    category: 'yogurt',
    brand: 'Mother Dairy',
    inStock: true
  }
]; 