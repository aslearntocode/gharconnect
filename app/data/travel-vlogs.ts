export interface TravelArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  author?: string;
}

export const articles: TravelArticle[] = [
  {
    id: 'usa',
    title: 'Exploring the Grand Canyon: A Journey Through Time',
    description: 'Experience the breathtaking views and geological wonders of one of America\'s most iconic natural landmarks.',
    category: 'North America',
    readTime: '5 min read',
    author: 'Rahul Sharma'
  },
  {
    id: 'ayra-farms',
    title: 'Weekend Getaway: Aryan Farms Experience',
    description: 'Discover the perfect blend of luxury and nature at this hidden gem just a few hours from Mumbai.',
    category: 'Within India',
    readTime: '3 min read',
    author: 'Priya Patel'
  },
  {
    id: 'spain',
    title: 'Barcelona: A City of Art and Architecture',
    description: 'From Gaudi\'s masterpieces to the vibrant streets of La Rambla, explore the cultural heart of Catalonia.',
    category: 'Europe',
    readTime: '7 min read',
    author: 'Amit Kumar'
  },
  {
    id: 'tanzania',
    title: 'Safari Adventure in Tanzania',
    description: 'Witness the great migration and experience the raw beauty of African wildlife in their natural habitat.',
    category: 'Africa',
    readTime: '8 min read',
    author: 'Aryan Mehta'
  }
];

export const getArticleLink = (society: string, articleId: string, category: string): string => {
  // Convert category to URL-friendly format
  const categoryPath = category.toLowerCase().replace(/\s+/g, '-');
  return `/${society}/travel-vlogs/${categoryPath}/${articleId}`;
}; 