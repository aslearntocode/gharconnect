import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { auth } from '@/lib/firebase'

export interface UserProfile {
  user_id: string
  society_name: string
  building_name: string
  apartment_number: string
  email: string
  phone?: string
  updated_at?: string
}

export const checkProfileCompletion = async (): Promise<{
  isComplete: boolean
  profile: UserProfile | null
  missingFields: string[]
}> => {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return {
        isComplete: false,
        profile: null,
        missingFields: ['User not authenticated']
      }
    }

    const supabase = createClientComponentClient()
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', currentUser.uid)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return {
          isComplete: false,
          profile: null,
          missingFields: ['society_name', 'building_name', 'apartment_number', 'email']
        }
      }
      console.error('Error fetching profile:', error)
      return {
        isComplete: false,
        profile: null,
        missingFields: ['Error fetching profile']
      }
    }

    if (!profile) {
      return {
        isComplete: false,
        profile: null,
        missingFields: ['society_name', 'building_name', 'apartment_number', 'email']
      }
    }

    // Check required fields
    const requiredFields = ['society_name', 'building_name', 'apartment_number', 'email']
    const missingFields: string[] = []

    requiredFields.forEach(field => {
      if (!profile[field as keyof UserProfile] || 
          String(profile[field as keyof UserProfile]).trim() === '') {
        missingFields.push(field)
      }
    })

    return {
      isComplete: missingFields.length === 0,
      profile,
      missingFields
    }
  } catch (error) {
    console.error('Error checking profile completion:', error)
    return {
      isComplete: false,
      profile: null,
      missingFields: ['Error checking profile']
    }
  }
} 