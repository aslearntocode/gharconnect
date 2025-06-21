import { z } from 'zod';

export const applicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Invalid email address.'),
  mobile_no: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits.'),
  family_members: z.preprocess(
    (val) => (val ? parseInt(String(val), 10) : undefined),
    z.number().int().min(1, 'At least one family member is required.')
  ),
  has_pets: z.preprocess(
    (val) => val === 'true',
    z.boolean()
  ),
  employment_status: z.string().min(1, 'Employment status is required.'),
  current_city: z.string().min(1, 'Current city is required.'),
  current_state: z.string().min(1, 'Current state is required.'),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>; 