export interface MeatProduct {
  id: string;
  name: string;
  description: string;
  sizes: {
    size: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'chicken' | 'mutton' | 'pork' | 'beef' | 'other';
  brand: string;
  inStock: boolean;
}

export const meatProducts: MeatProduct[] = [
  {
    id: 'chicken-1',
    name: 'Whole Chicken',
    description: 'Fresh whole chicken',
    sizes: [
      { size: '500g', price: 4.99, unit: 'piece' },
      { size: '1kg', price: 8.99, unit: 'piece' },
      { size: '2kg', price: 16.99, unit: 'piece' }
    ],
    image: '/images/meat/chicken.jpg',
    category: 'chicken',
    brand: 'Fresh Meats',
    inStock: true
  },
  {
    id: 'mutton-1',
    name: 'Mutton Curry Cut',
    description: 'Fresh mutton curry cut pieces',
    sizes: [
      { size: '500g', price: 12.99, unit: 'pack' },
      { size: '1kg', price: 24.99, unit: 'pack' },
      { size: '2kg', price: 47.99, unit: 'pack' }
    ],
    image: '/images/meat/mutton.jpg',
    category: 'mutton',
    brand: 'Fresh Meats',
    inStock: true
  },
  {
    id: 'pork-1',
    name: 'Pork Belly',
    description: 'Fresh pork belly slices',
    sizes: [
      { size: '250g', price: 6.99, unit: 'pack' },
      { size: '500g', price: 12.99, unit: 'pack' },
      { size: '1kg', price: 24.99, unit: 'pack' }
    ],
    image: '/images/meat/pork.jpg',
    category: 'pork',
    brand: 'Fresh Meats',
    inStock: true
  },
  {
    id: 'beef-1',
    name: 'Beef Steak',
    description: 'Premium quality beef steak',
    sizes: [
      { size: '200g', price: 8.99, unit: 'piece' },
      { size: '400g', price: 16.99, unit: 'piece' },
      { size: '600g', price: 24.99, unit: 'piece' }
    ],
    image: '/images/meat/beef.jpg',
    category: 'beef',
    brand: 'Fresh Meats',
    inStock: true
  },
  {
    id: 'chicken-2',
    name: 'Chicken Breast',
    description: 'Boneless chicken breast fillets',
    sizes: [
      { size: '250g', price: 5.99, unit: 'pack' },
      { size: '500g', price: 10.99, unit: 'pack' },
      { size: '1kg', price: 19.99, unit: 'pack' }
    ],
    image: '/images/meat/chicken-breast.jpg',
    category: 'chicken',
    brand: 'Meat Masters',
    inStock: true
  },
  {
    id: 'mutton-2',
    name: 'Mutton Chops',
    description: 'Fresh mutton chops',
    sizes: [
      { size: '250g', price: 7.99, unit: 'pack' },
      { size: '500g', price: 14.99, unit: 'pack' },
      { size: '1kg', price: 27.99, unit: 'pack' }
    ],
    image: '/images/meat/mutton-chops.jpg',
    category: 'mutton',
    brand: 'Meat Masters',
    inStock: true
  },
  {
    id: 'pork-2',
    name: 'Pork Chops',
    description: 'Fresh pork chops',
    sizes: [
      { size: '250g', price: 5.99, unit: 'pack' },
      { size: '500g', price: 10.99, unit: 'pack' },
      { size: '1kg', price: 19.99, unit: 'pack' }
    ],
    image: '/images/meat/pork-chops.jpg',
    category: 'pork',
    brand: 'Meat Masters',
    inStock: true
  },
  {
    id: 'beef-2',
    name: 'Beef Mince',
    description: 'Fresh ground beef mince',
    sizes: [
      { size: '250g', price: 6.99, unit: 'pack' },
      { size: '500g', price: 12.99, unit: 'pack' },
      { size: '1kg', price: 23.99, unit: 'pack' }
    ],
    image: '/images/meat/beef-mince.jpg',
    category: 'beef',
    brand: 'Meat Masters',
    inStock: true
  }
]; 