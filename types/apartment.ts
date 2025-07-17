export interface Apartment {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  building_name: string;
  street_name: string;
  tower: string;
  apartment_number: string;
  city: string;
  state: string;
  pincode: string;
  location?: string; // Parel or Worli
  apartment_type: string;
  accommodation_type?: string; // 'PG' or 'Apartment'
  floor_number?: number;
  total_floors?: number;
  carpet_area: number;
  rent_amount: number;
  security_deposit: number;
  available_from?: string;
  furnishing_status?: string;
  parking_available: boolean;
  parking_type?: string;
  amenities?: string[];
  pet_friendly: boolean;
  veg_non_veg_allowed?: boolean;
  balcony_count?: number;
  bachelor_allowed: boolean;
  preferred_tenant_type?: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  images?: string[];
  status?: string; // 'active' or 'inactive' - inactive means already rented
  created_at?: string;
  updated_at?: string;
}

export const APARTMENT_TYPES = [
  '1BHK',
  '1.5BHK',
  '2BHK',
  '2.5BHK',
  '3BHK',
  '3.5BHK',
  '4BHK',
  '4.5BHK',
  '5BHK+',
  'Studio',
  'Penthouse',
  'Villa'
] as const;

export const FURNISHING_STATUS = [
  'Unfurnished',
  'Semi-furnished',
  'Fully-furnished'
] as const;

export const PARKING_TYPES = [
  '2-wheeler',
  '4-wheeler',
  'Both'
] as const;

export const PREFERRED_TENANT_TYPES = [
  'Any',
  'Family',
  'Bachelor',
  'Working Professional',
  'Student'
] as const;

export const AMENITIES_OPTIONS = [
  'Air Conditioning',
  'Balcony',
  'Gym',
  'Swimming Pool',
  'Garden',
  'Security',
  'Lift',
  'Power Backup',
  'Water Supply',
  'Internet',
  'CCTV',
  'Visitor Parking',
  'Children\'s Play Area',
  'Clubhouse',
  'Tennis Court',
  'Basketball Court',
  'Badminton Court',
  'Squash Court',
  'Table Tennis',
  'Indoor Games',
  'Library',
  'Party Hall',
  'Guest House',
  'Servant Quarters',
  'Modular Kitchen',
  'Wardrobes',
  'Geyser',
  'Washing Machine',
  'Refrigerator',
  'Microwave',
  'Dishwasher',
  'Gas Connection',
  'RO Water',
  'Solar Water Heater',
  'Solar Panels',
  'Rainwater Harvesting',
  'Waste Management',
  'Fire Safety',
  'Earthquake Resistant',
  'Vaastu Compliant'
] as const; 