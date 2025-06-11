export interface FruitProduct {
  id: string;
  name: string;
  description: string;
  sizes: {
    size: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'citrus' | 'tropical' | 'berries' | 'stone' | 'other';
  brand: string;
  inStock: boolean;
}

export const fruitProducts: FruitProduct[] = [
  {
    id: 'apple-1',
    name: 'Red Delicious Apples',
    description: 'Sweet and crisp red apples',
    sizes: [
      { size: '500g', price: 2.99, unit: 'pack' },
      { size: '1kg', price: 4.99, unit: 'pack' },
      { size: '2kg', price: 8.99, unit: 'pack' }
    ],
    image: '/images/fruits/apple.jpg',
    category: 'other',
    brand: 'Fresh Fruits',
    inStock: true
  },
  {
    id: 'orange-1',
    name: 'Sweet Oranges',
    description: 'Juicy and sweet oranges',
    sizes: [
      { size: '500g', price: 2.49, unit: 'pack' },
      { size: '1kg', price: 4.49, unit: 'pack' },
      { size: '2kg', price: 7.99, unit: 'pack' }
    ],
    image: '/images/fruits/orange.jpg',
    category: 'citrus',
    brand: 'Fresh Fruits',
    inStock: true
  },
  {
    id: 'mango-1',
    name: 'Alphonso Mangoes',
    description: 'Premium quality Alphonso mangoes',
    sizes: [
      { size: '1pc', price: 3.99, unit: 'piece' },
      { size: '3pc', price: 10.99, unit: 'pack' },
      { size: '6pc', price: 19.99, unit: 'pack' }
    ],
    image: '/images/fruits/mango.jpg',
    category: 'tropical',
    brand: 'Fresh Fruits',
    inStock: true
  },
  {
    id: 'strawberry-1',
    name: 'Fresh Strawberries',
    description: 'Sweet and juicy strawberries',
    sizes: [
      { size: '200g', price: 3.99, unit: 'pack' },
      { size: '500g', price: 8.99, unit: 'pack' },
      { size: '1kg', price: 15.99, unit: 'pack' }
    ],
    image: '/images/fruits/strawberry.jpg',
    category: 'berries',
    brand: 'Fresh Fruits',
    inStock: true
  },
  {
    id: 'peach-1',
    name: 'Yellow Peaches',
    description: 'Sweet and juicy peaches',
    sizes: [
      { size: '1pc', price: 2.49, unit: 'piece' },
      { size: '4pc', price: 8.99, unit: 'pack' },
      { size: '8pc', price: 15.99, unit: 'pack' }
    ],
    image: '/images/fruits/peach.jpg',
    category: 'stone',
    brand: 'Fruit Paradise',
    inStock: true
  },
  {
    id: 'banana-1',
    name: 'Yellow Bananas',
    description: 'Sweet and ripe bananas',
    sizes: [
      { size: '6pc', price: 1.99, unit: 'bunch' },
      { size: '12pc', price: 3.49, unit: 'bunch' },
      { size: '24pc', price: 6.49, unit: 'bunch' }
    ],
    image: '/images/fruits/banana.jpg',
    category: 'tropical',
    brand: 'Fruit Paradise',
    inStock: true
  },
  {
    id: 'blueberry-1',
    name: 'Fresh Blueberries',
    description: 'Sweet and plump blueberries',
    sizes: [
      { size: '125g', price: 3.99, unit: 'pack' },
      { size: '250g', price: 6.99, unit: 'pack' },
      { size: '500g', price: 12.99, unit: 'pack' }
    ],
    image: '/images/fruits/blueberry.jpg',
    category: 'berries',
    brand: 'Fruit Paradise',
    inStock: true
  },
  {
    id: 'plum-1',
    name: 'Red Plums',
    description: 'Sweet and juicy plums',
    sizes: [
      { size: '1pc', price: 1.99, unit: 'piece' },
      { size: '4pc', price: 6.99, unit: 'pack' },
      { size: '8pc', price: 12.99, unit: 'pack' }
    ],
    image: '/images/fruits/plum.jpg',
    category: 'stone',
    brand: 'Fruit Paradise',
    inStock: true
  }
]; 