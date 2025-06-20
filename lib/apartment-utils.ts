import { supabase } from './supabaseClient';
import { Apartment } from '@/types/apartment';
import { ApartmentFormData } from './apartment-schema';

export async function createApartment(apartmentData: ApartmentFormData, userId: string, location?: string): Promise<{ success: boolean; data?: Apartment; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('apartments')
      .insert({
        ...apartmentData,
        user_id: userId,
        status: 'active',
        location: location ?? null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating apartment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating apartment:', error);
    return { success: false, error: 'Failed to create apartment listing' };
  }
}

export async function getApartmentsByUser(userId: string): Promise<{ success: boolean; data?: Apartment[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user apartments:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching user apartments:', error);
    return { success: false, error: 'Failed to fetch apartment listings' };
  }
}

export async function getAllActiveApartments(): Promise<{ success: boolean; data?: Apartment[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active apartments:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching active apartments:', error);
    return { success: false, error: 'Failed to fetch apartment listings' };
  }
}

export async function getApartmentById(id: string): Promise<{ success: boolean; data?: Apartment; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching apartment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching apartment:', error);
    return { success: false, error: 'Failed to fetch apartment details' };
  }
}

export async function updateApartment(id: string, apartmentData: Partial<ApartmentFormData>): Promise<{ success: boolean; data?: Apartment; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('apartments')
      .update(apartmentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating apartment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating apartment:', error);
    return { success: false, error: 'Failed to update apartment listing' };
  }
}

export async function deleteApartment(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('apartments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting apartment:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting apartment:', error);
    return { success: false, error: 'Failed to delete apartment listing' };
  }
}

export async function searchApartments(filters: {
  city?: string;
  minRent?: number;
  maxRent?: number;
  apartmentType?: string;
  furnishingStatus?: string;
  petFriendly?: boolean;
  parkingAvailable?: boolean;
}): Promise<{ success: boolean; data?: Apartment[]; error?: string }> {
  try {
    let query = supabase
      .from('apartments')
      .select('*')
      .eq('status', 'active');

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters.minRent) {
      query = query.gte('rent_amount', filters.minRent);
    }

    if (filters.maxRent) {
      query = query.lte('rent_amount', filters.maxRent);
    }

    if (filters.apartmentType) {
      query = query.eq('apartment_type', filters.apartmentType);
    }

    if (filters.furnishingStatus) {
      query = query.eq('furnishing_status', filters.furnishingStatus);
    }

    if (filters.petFriendly !== undefined) {
      query = query.eq('pet_friendly', filters.petFriendly);
    }

    if (filters.parkingAvailable !== undefined) {
      query = query.eq('parking_available', filters.parkingAvailable);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching apartments:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error searching apartments:', error);
    return { success: false, error: 'Failed to search apartment listings' };
  }
} 