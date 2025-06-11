export interface VegetableProduct {
  id: string;
  name: string;
  description: string;
  sizes: {
    size: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'leafy' | 'root' | 'cruciferous' | 'allium' | 'other';
  brand: string;
  inStock: boolean;
}

export const vegetableProducts: VegetableProduct[] = [
  {
    id: 'spinach-1',
    name: 'Fresh Spinach',
    description: 'Organic fresh spinach leaves',
    sizes: [
      { size: '100g', price: 1.99, unit: 'bunch' },
      { size: '250g', price: 3.99, unit: 'bunch' },
      { size: '500g', price: 6.99, unit: 'bunch' }
    ],
    image: '/images/vegetables/spinach.jpg',
    category: 'leafy',
    brand: 'Fresh Farms',
    inStock: true
  },
  {
    id: 'potato-1',
    name: 'Baby Potatoes',
    description: 'Fresh baby potatoes, perfect for roasting',
    sizes: [
      { size: '500g', price: 2.49, unit: 'bag' },
      { size: '1kg', price: 4.49, unit: 'bag' },
      { size: '2kg', price: 7.99, unit: 'bag' }
    ],
    image: '/images/vegetables/potato.jpg',
    category: 'root',
    brand: 'Fresh Farms',
    inStock: true
  },
  {
    id: 'broccoli-1',
    name: 'Broccoli',
    description: 'Fresh green broccoli florets',
    sizes: [
      { size: '200g', price: 2.99, unit: 'piece' },
      { size: '500g', price: 5.99, unit: 'piece' },
      { size: '1kg', price: 10.99, unit: 'piece' }
    ],
    image: '/images/vegetables/broccoli.jpg',
    category: 'cruciferous',
    brand: 'Fresh Farms',
    inStock: true
  },
  {
    id: 'onion-1',
    name: 'Red Onions',
    description: 'Fresh red onions',
    sizes: [
      { size: '500g', price: 1.99, unit: 'bag' },
      { size: '1kg', price: 3.49, unit: 'bag' },
      { size: '2kg', price: 6.49, unit: 'bag' }
    ],
    image: '/images/vegetables/onion.jpg',
    category: 'allium',
    brand: 'Fresh Farms',
    inStock: true
  },
  {
    id: 'lettuce-1',
    name: 'Iceberg Lettuce',
    description: 'Crisp iceberg lettuce',
    sizes: [
      { size: '1pc', price: 1.49, unit: 'piece' },
      { size: '3pc', price: 3.99, unit: 'pack' },
      { size: '5pc', price: 5.99, unit: 'pack' }
    ],
    image: '/images/vegetables/lettuce.jpg',
    category: 'leafy',
    brand: 'Green Valley',
    inStock: true
  },
  {
    id: 'carrot-1',
    name: 'Baby Carrots',
    description: 'Sweet baby carrots',
    sizes: [
      { size: '250g', price: 1.99, unit: 'pack' },
      { size: '500g', price: 3.49, unit: 'pack' },
      { size: '1kg', price: 5.99, unit: 'pack' }
    ],
    image: '/images/vegetables/carrot.jpg',
    category: 'root',
    brand: 'Green Valley',
    inStock: true
  },
  {
    id: 'cauliflower-1',
    name: 'Cauliflower',
    description: 'Fresh white cauliflower',
    sizes: [
      { size: '1pc', price: 2.99, unit: 'piece' },
      { size: '2pc', price: 5.49, unit: 'pack' },
      { size: '3pc', price: 7.99, unit: 'pack' }
    ],
    image: '/images/vegetables/cauliflower.jpg',
    category: 'cruciferous',
    brand: 'Green Valley',
    inStock: true
  },
  {
    id: 'garlic-1',
    name: 'Fresh Garlic',
    description: 'Premium quality garlic bulbs',
    sizes: [
      { size: '100g', price: 1.49, unit: 'pack' },
      { size: '250g', price: 3.49, unit: 'pack' },
      { size: '500g', price: 6.49, unit: 'pack' }
    ],
    image: '/images/vegetables/garlic.jpg',
    category: 'allium',
    brand: 'Green Valley',
    inStock: true
  }
]; 