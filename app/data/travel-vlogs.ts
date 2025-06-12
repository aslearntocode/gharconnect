export type Article = {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  author?: string
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'USA Travel Vlog',
    description: 'Explore the best places to visit in the USA and plan your next trip.',
    category: 'USA',
    readTime: '10 min read',
    author: 'Aryan'
  },
  {
    id: '2',
    title: 'My Travel to Ayra Farms',
    description: 'Explore the best places to visit in Ayra Farma and plan your next trip.',
    category: 'Within-India',
    readTime: '8 min read',
    author: 'Aryan'
  },
  {
    id: '3',
    title: 'Spain - A Country of Culture and History',
    description: 'Explore the best places to visit in Spain and plan your next trip.',
    category: 'Europe',
    readTime: '10 min read',
    author: 'Aryan'
  },
  {
    id: '4',
    title: 'My 15 Days Itinerary to Tanzania',
    description: 'Explore the best places to visit in Tanzania and plan your next trip.',
    category: 'Africa',
    readTime: '15 min read',
    author: 'Aryan'
  }
]

// Helper function to get article link based on society
export const getArticleLink = (society: string, articleId: string, category: string) => {
  const basePath = `/${society}/travel-vlogs`
  
  // Map article IDs to their specific paths
  const pathMap: Record<string, string> = {
    '1': 'usa',
    '2': 'within-India/ayra-farms',
    '3': 'europe/spain',
    '4': 'africa/aryan/tanzania'
  }
  
  return `${basePath}/${pathMap[articleId] || category.toLowerCase()}`
} 