export interface Talent {
  id: string;
  society: string;
  name: string;
  category: string;
  description: string;
  main_image: string;
  images: string[];
  contact: {
    phone: string;
    email: string;
    location: string;
  };
  rating: number;
  review_count: number;
  experience: string;
  pricing: string;
  availability: string;
  created_at: string;
  updated_at: string;
  skills: string[];
  about: string;
  portfolio: string[];
  is_verified: boolean;
  is_active: boolean;
}

export interface Review {
  id: string;
  talent_id: string;
  user_id?: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface TalentCategory {
  id: string;
  name: string;
  icon: any; // React component
} 