import { Talent } from '@/types/talent';

export const neighborhoodServiceProviders: Talent[] = [
  {
    id: 'the-inkables',
    society: 'parel',
    name: 'The Inkables',
    category: 'Art & Craft',
    description: `✨ From Smiles to Stationery!
I'm a Dentist turned Entrepreneur with a passion for creativity, kids, and all things personalized! What began as a love for making children smile has grown into a vibrant venture offering a wide range of personalized gifting, stationery, and school supplies — perfect for kids and adults alike.

🎁 From quirky gifts to practical school essentials, we bring joy to every age with custom-designed products that are thoughtful, fun, and full of personality. Whether it's for a birthday, return gift, teacher's hamper, office desk, or just because — we've got something special for everyone.

Let's turn everyday essentials into something extra special!`,
    main_image: '/images/neighbors/Inkables Logo.jpg',
    images: [
      '/images/neighbors/inkables/Img_1.jpg',
      '/images/neighbors/inkables/Img_2.jpg',
      '/images/neighbors/inkables/Img_3.jpg',
      '/images/neighbors/inkables/Img_4.jpg',
      '/images/neighbors/inkables/Img_5.jpg',
      '/images/neighbors/inkables/Img_6.jpg',
      '/images/neighbors/inkables/Img_7.jpg',
      '/images/neighbors/inkables/Img_8.jpg',
      '/images/neighbors/inkables/Img_9.jpg',
      '/images/neighbors/inkables/Img_10.jpg'
    ],
    contact: {
      phone: '+91 88796 06458',
      email: 'theinkables@gmail.com',
      location: 'Sewri, Mumbai'
    },
    experience: '3 years',
    pricing: 'Contact for pricing',
    availability: 'Anytime',
    skills: ['Stationery', 'Gifting', 'Personalized Products', 'Custom Designs'],
    portfolio: ['https://www.instagram.com/the.inkables/'],
    is_verified: true,
    is_active: true,
    rating: 4.8,
    review_count: 23,
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z',
  },
  {
    id: 'rahul-patel',
    society: 'parel',
    name: 'Rahul Patel',
    category: 'photography',
    description: 'Award-winning photographer specializing in portrait and event photography. Available for weddings, corporate events, and personal shoots.',
    main_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=400&fit=crop',
    ],
    contact: {
      phone: '+91 98765 43211',
      email: 'rahul.patel@email.com',
      location: 'Parel, Mumbai'
    },
    experience: '5+ years',
    pricing: '₹3000/session',
    availability: 'Weekends and evenings',
    skills: ['Portrait Photography', 'Event Photography', 'Wedding Photography', 'Photo Editing'],
    about: 'I am a professional photographer with 5+ years of experience capturing beautiful moments. I specialize in portrait photography, wedding photography, and corporate events. My work has been featured in several local magazines and exhibitions.',
    portfolio: ['https://instagram.com/rahulpatelphotography', 'https://500px.com/rahulpatel'],
    is_verified: true,
    is_active: true,
    rating: 4.9,
    review_count: 18,
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
  },
  {
    id: 'nupur-the-wooden-spoon',
    society: 'peddar road',
    name: 'Nupur - The Wooden Spoon',
    category: 'Baking',
    description: 'Makes customized Birthday Cake, Wedding Cake, Anniversary Cake, etc.',
    main_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    ],
    contact: {
      phone: '+91 98200 42978',
      email: 'nupurvarma@hotmail.com',
      location: 'Chancellor Court ML Dhanukar Marg, Mumbai'
    },
    experience: '5+ years',
    pricing: 'Contact for pricing',
    availability: 'Weekdays 4-8 PM, Weekends 9 AM-5 PM',
    skills: ['Cooking', 'Baking', 'Home-made', 'Home-made cake', 'Home-made food delivery', 'Customized Cakes', 'Customized Food'],
    about: 'I am a passionate mathematics teacher with 6+ years of experience teaching students from grades 6-12. I specialize in CBSE and ICSE curriculum and have helped many students improve their grades significantly. My teaching approach focuses on building strong fundamentals and problem-solving skills.',
    portfolio: ['https://www.instagram.com/the.wooden.spoon/'],
    is_verified: true,
    is_active: true,
    rating: 4.7,
    review_count: 31,
    created_at: '2024-01-08T09:15:00Z',
    updated_at: '2024-01-08T09:15:00Z',
  }
];

// Helper functions to filter data
export const getProvidersBySociety = (society: string): Talent[] => {
  // Return all providers regardless of society to make them visible across all locations
  return neighborhoodServiceProviders;
};

export const getProviderById = (id: string): Talent | undefined => {
  return neighborhoodServiceProviders.find(provider => provider.id === id);
};

export const searchProviders = (query: string, society?: string): Talent[] => {
  // Search across all providers regardless of society to make them visible across all locations
  return neighborhoodServiceProviders.filter(provider => 
    provider.name.toLowerCase().includes(query.toLowerCase()) ||
    provider.description.toLowerCase().includes(query.toLowerCase()) ||
    provider.contact.location.toLowerCase().includes(query.toLowerCase()) ||
    provider.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
  );
};

export const getProvidersByCategory = (category: string, society?: string): Talent[] => {
  // Return providers across all societies regardless of society parameter
  return neighborhoodServiceProviders.filter(provider => provider.category === category);
}; 