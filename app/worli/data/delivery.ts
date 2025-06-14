export interface DeliveryCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

export const deliveryCategories: DeliveryCategory[] = [
  {
    id: '1',
    name: 'Dairy',
    description: 'Fresh milk, cheese, butter, and more delivered to your door',
    icon: '🥛',
    slug: 'dairy'
  },
  {
    id: '2',
    name: 'Meat',
    description: 'Quality meat and poultry products, hygienically packed',
    icon: '🍗',
    slug: 'meat'
  },
  {
    id: '3',
    name: 'Fruits',
    description: 'Fresh and seasonal fruits delivered to your doorstep',
    icon: '🍎',
    slug: 'fruits'
  },
  {
    id: '4',
    name: 'Vegetables',
    description: 'Fresh vegetables and greens delivered daily',
    icon: '🥬',
    slug: 'vegetables'
  }
]; 