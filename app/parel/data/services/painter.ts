export interface PainterService {
  id: string;
  name: string;
  description: string;
  services: {
    type: string;
    price: number;
    unit: string;
  }[];
  image: string;
  category: 'interior' | 'exterior' | 'special' | 'other';
  brand: string;
  inStock: boolean;
}

export const painterServices: PainterService[] = [
  {
    id: 'interior-1',
    name: 'Interior Painting',
    description: 'Professional interior wall painting service',
    services: [
      { type: '1 BHK', price: 299.99, unit: 'flat' },
      { type: '2 BHK', price: 499.99, unit: 'flat' },
      { type: '3 BHK', price: 699.99, unit: 'flat' }
    ],
    image: '/images/services/interior-painting.jpg',
    category: 'interior',
    brand: 'Color Masters',
    inStock: true
  },
  {
    id: 'exterior-1',
    name: 'Exterior Painting',
    description: 'Professional exterior wall painting service',
    services: [
      { type: '1 BHK', price: 399.99, unit: 'flat' },
      { type: '2 BHK', price: 599.99, unit: 'flat' },
      { type: '3 BHK', price: 799.99, unit: 'flat' }
    ],
    image: '/images/services/exterior-painting.jpg',
    category: 'exterior',
    brand: 'Color Masters',
    inStock: true
  },
  {
    id: 'special-1',
    name: 'Special Effects',
    description: 'Special painting effects and textures',
    services: [
      { type: 'Textured Walls', price: 4.99, unit: 'sqft' },
      { type: 'Stencil Work', price: 6.99, unit: 'sqft' },
      { type: 'Murals', price: 9.99, unit: 'sqft' }
    ],
    image: '/images/services/special-effects.jpg',
    category: 'special',
    brand: 'Color Masters',
    inStock: true
  },
  {
    id: 'interior-2',
    name: 'Premium Interior',
    description: 'Premium interior painting with designer colors',
    services: [
      { type: '1 BHK', price: 399.99, unit: 'flat' },
      { type: '2 BHK', price: 599.99, unit: 'flat' },
      { type: '3 BHK', price: 799.99, unit: 'flat' }
    ],
    image: '/images/services/premium-interior.jpg',
    category: 'interior',
    brand: 'Paint Pro',
    inStock: true
  },
  {
    id: 'exterior-2',
    name: 'Premium Exterior',
    description: 'Premium exterior painting with weather protection',
    services: [
      { type: '1 BHK', price: 499.99, unit: 'flat' },
      { type: '2 BHK', price: 699.99, unit: 'flat' },
      { type: '3 BHK', price: 899.99, unit: 'flat' }
    ],
    image: '/images/services/premium-exterior.jpg',
    category: 'exterior',
    brand: 'Paint Pro',
    inStock: true
  },
  {
    id: 'special-2',
    name: 'Premium Effects',
    description: 'Premium special effects and finishes',
    services: [
      { type: 'Premium Textures', price: 6.99, unit: 'sqft' },
      { type: 'Custom Designs', price: 8.99, unit: 'sqft' },
      { type: 'Artistic Murals', price: 12.99, unit: 'sqft' }
    ],
    image: '/images/services/premium-effects.jpg',
    category: 'special',
    brand: 'Paint Pro',
    inStock: true
  }
]; 