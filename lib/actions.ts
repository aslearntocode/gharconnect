'use server';

import { getSupabaseClient } from '@/lib/supabase';
import { apartmentFormSchema, ApartmentFormData } from './apartment-schema';
import { applicationSchema, ApplicationFormData } from './application-schema';

export async function createApartment(formData: ApartmentFormData, userId: string) {
  try {
    const validatedData = apartmentFormSchema.parse(formData);
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from('apartments').insert([
      { ...validatedData, 
        user_id: userId,
        // Ensure location is passed if it's part of your form/schema
        // location: validatedData.location 
      },
    ]).select();
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating apartment:', error);
    return { success: false, error: error.message };
  }
}

export async function createRentalApplication(
  formData: ApplicationFormData,
  apartmentId: string,
  landlordUserId: string,
  applicantUserId: string
) {
  try {
    console.log('Validating form data...');
    const validatedData = applicationSchema.parse(formData);
    console.log('Form data validated successfully:', validatedData);

    console.log('Preparing data for insertion:', {
      ...validatedData,
      apartment_id: apartmentId,
      landlord_user_id: landlordUserId,
      applicant_user_id: applicantUserId,
    });

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('rental_applications')
      .insert([
        {
          ...validatedData,
          apartment_id: apartmentId,
          landlord_user_id: landlordUserId,
          applicant_user_id: applicantUserId,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Application created successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating rental application:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}
