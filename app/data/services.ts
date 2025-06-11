export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: '1',
    name: 'Laundry',
    description: 'Professional laundry and dry cleaning services',
    icon: '🧺',
    slug: 'laundry'
  },
  {
    id: '2',
    name: 'Carpenter',
    description: 'Expert woodworking and furniture repair',
    icon: '🔨',
    slug: 'carpenter'
  },
  {
    id: '3',
    name: 'Electrician',
    description: 'Electrical repairs and installations',
    icon: '⚡',
    slug: 'electrician'
  },
  {
    id: '4',
    name: 'Plumber',
    description: 'Plumbing repairs and maintenance',
    icon: '🔧',
    slug: 'plumber'
  },
  {
    id: '5',
    name: 'House Cleaning',
    description: 'Professional home cleaning services',
    icon: '🧹',
    slug: 'house-cleaning'
  },
  {
    id: '6',
    name: 'Painter',
    description: 'Interior and exterior painting services',
    icon: '🎨',
    slug: 'painter'
  }
]; 