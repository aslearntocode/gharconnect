import { z } from 'zod';
import { APARTMENT_TYPES, FURNISHING_STATUS, PARKING_TYPES, PREFERRED_TENANT_TYPES } from '@/types/apartment';

export const apartmentFormSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  
  building_name: z.string()
    .min(2, 'Building name must be at least 2 characters')
    .max(100, 'Building name must be less than 100 characters'),
  
  street_name: z.string()
    .min(5, 'Street name must be at least 5 characters')
    .max(150, 'Street name must be less than 150 characters'),
  
  tower: z.string()
    .min(1, 'Tower is required')
    .max(50, 'Tower must be less than 50 characters'),
  
  apartment_number: z.string()
    .min(1, 'Apartment number is required')
    .max(20, 'Apartment number must be less than 20 characters'),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters'),
  
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters'),
  
  pincode: z.string()
    .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  
  apartment_type: z.enum(APARTMENT_TYPES as unknown as [string, ...string[]]),
  
  floor_number: z.preprocess(
    (val) => (val === '' || val === undefined) ? undefined : Number(val),
    z.number()
      .min(0, 'Floor number must be 0 or greater')
      .max(100, 'Floor number must be less than 100')
      .optional()
  ),
  
  carpet_area: z.preprocess(
    (val) => Number(val),
    z.number()
      .min(100, 'Carpet area must be at least 100 sq ft')
      .max(10000, 'Carpet area must be less than 10,000 sq ft')
  ),
  
  rent_amount: z.preprocess(
    (val) => Number(val),
    z.number()
      .min(1000, 'Rent amount must be at least ₹1,000')
      .max(1000000, 'Rent amount must be less than ₹10,00,000')
  ),
  
  security_deposit: z.preprocess(
    (val) => Number(val),
    z.number()
      .min(0, 'Security deposit cannot be negative')
      .max(1000000, 'Security deposit must be less than ₹10,00,000')
  ),
  
  available_from: z.preprocess(
    (arg) => {
      if (!arg || arg === '') return undefined;
      return arg;
    },
    z.string()
      .refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }, 'Available from date must be today or in the future')
      .optional()
  ),
  
  furnishing_status: z.enum(FURNISHING_STATUS as unknown as [string, ...string[]]).optional(),
  
  parking_available: z.preprocess(
    (val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') return val === 'true';
      return false;
    },
    z.boolean()
  ),
  
  parking_type: z.enum(PARKING_TYPES as unknown as [string, ...string[]]).optional(),
  
  amenities: z.array(z.string())
    .max(10, 'You can select up to 10 amenities')
    .optional(),
  
  pet_friendly: z.preprocess(
    (val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') return val === 'true';
      return false;
    },
    z.boolean()
  ),
  
  bachelor_allowed: z.preprocess(
    (val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') return val === 'true';
      return true;
    },
    z.boolean()
  ),
  
  preferred_tenant_type: z.enum(PREFERRED_TENANT_TYPES as unknown as [string, ...string[]]).optional(),
  
  contact_name: z.string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(50, 'Contact name must be less than 50 characters'),
  
  contact_phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  
  contact_email: z.string()
    .email('Please enter a valid email address')
    .optional(),
});

export type ApartmentFormData = z.infer<typeof apartmentFormSchema>; 