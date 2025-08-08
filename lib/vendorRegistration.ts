import { supabase } from '@/lib/supabase-auth'

export interface VendorRegistrationData {
  name: string
  mobile_no: string
  services: string
  area: string
  societies: string[]
  slot_type: string
  slot_start_time: string
  slot_end_time: string
  is_available?: boolean
}

export interface VendorSlot {
  id: string
  label: string
  start: string
  end: string
}

export const PERMANENT_SLOTS: VendorSlot[] = [
  { id: 'morning', label: 'Morning', start: '07:00', end: '12:00' },
  { id: 'afternoon', label: 'Afternoon', start: '12:00', end: '17:00' },
  { id: 'evening', label: 'Evening', start: '17:00', end: '20:00' },
  { id: '24hours', label: '24 Hours', start: '00:00', end: '23:59' },
]

/**
 * Insert vendor data into vendor_permanent_availability without authentication
 * @param vendorData - The vendor registration data
 * @param selectedSlots - Array of selected slot IDs (e.g., ['morning', 'afternoon', '24hours'])
 * @returns Promise with success/error result
 */
export async function insertVendorWithoutAuth(
  vendorData: Omit<VendorRegistrationData, 'slot_type' | 'slot_start_time' | 'slot_end_time'>,
  selectedSlots: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    

    // Validate input
    if (!vendorData.name || !vendorData.mobile_no || !vendorData.services || !vendorData.area) {
      return { success: false, error: 'Missing required fields' }
    }

    if (vendorData.societies.length === 0) {
      return { success: false, error: 'At least one society must be selected' }
    }

    if (selectedSlots.length === 0) {
      return { success: false, error: 'At least one time slot must be selected' }
    }

    // Check if mobile number already exists
    const { data: existingVendor, error: checkError } = await supabase
      .from('vendor_permanent_availability')
      .select('mobile_no, name')
      .eq('mobile_no', vendorData.mobile_no)
      .limit(1)

    if (checkError) {
      console.error('Check error:', checkError)
      return { success: false, error: 'Failed to check existing vendor' }
    }

    if (existingVendor && existingVendor.length > 0) {
      return { success: false, error: 'A vendor with this mobile number already exists. Please use a different mobile number or contact support if you need to update your information.' }
    }

    // Generate a unique vendor_id for this vendor
    const vendorId = `vendor_${vendorData.mobile_no}_${Date.now()}`

    // Prepare data for insertion
    const societiesString = `{${vendorData.societies.map(s => `"${s}"`).join(',')}}`
    
    const rows = selectedSlots.map(slotId => {
      const slot = PERMANENT_SLOTS.find(s => s.id === slotId)
      return {
        vendor_id: vendorId, // Use the generated vendor_id
        name: vendorData.name,
        mobile_no: vendorData.mobile_no,
        services: vendorData.services,
        area: vendorData.area,
        societies: societiesString,
        slot_type: slotId,
        slot_start_time: slot?.start || '',
        slot_end_time: slot?.end || '',
        is_available: vendorData.is_available ?? true,
      }
    })

    // Insert data
    const { error } = await supabase
      .from('vendor_permanent_availability')
      .insert(rows)

    if (error) {
      console.error('Insert error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Vendor registration error:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

/**
 * Get all vendors from vendor_permanent_availability (including those without vendor_id)
 * @param area - Optional area filter
 * @returns Promise with vendor data
 */
export async function getAllVendors(area?: string): Promise<any[]> {
  try {
    
    
    let query = supabase
      .from('vendor_permanent_availability')
      .select('*')
      .order('created_at', { ascending: false })

    if (area) {
      query = query.ilike('area', `%${area}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch error:', error)
      throw new Error(error.message)
    }

    return data || []
  } catch (error: any) {
    console.error('Get vendors error:', error)
    throw error
  }
}

/**
 * Update vendor_id for existing records (when vendor authenticates later)
 * @param mobileNo - Mobile number to match
 * @param vendorId - Firebase user ID
 * @returns Promise with success/error result
 */
export async function updateVendorId(mobileNo: string, vendorId: string): Promise<{ success: boolean; error?: string }> {
  try {
    

    const { error } = await supabase
      .from('vendor_permanent_availability')
      .update({ vendor_id: vendorId })
      .eq('mobile_no', mobileNo)
      .is('vendor_id', null)

    if (error) {
      console.error('Update error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Update vendor ID error:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

/**
 * Clean up conflicting vendor slots - remove other slots when 24hours is present
 * This function should be run once to clean up existing data
 * @returns Promise with success/error result
 */
export async function cleanupConflictingVendorSlots(): Promise<{ success: boolean; error?: string; cleanedCount?: number }> {
  try {
    

    // First, get all vendors that have 24hours slot
    const { data: vendorsWith24Hours, error: fetchError } = await supabase
      .from('vendor_permanent_availability')
      .select('mobile_no, name')
      .eq('slot_type', '24hours')

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return { success: false, error: fetchError.message }
    }

    if (!vendorsWith24Hours || vendorsWith24Hours.length === 0) {
      return { success: true, cleanedCount: 0 }
    }

    let cleanedCount = 0

    // For each vendor with 24hours, remove their other slots
    for (const vendor of vendorsWith24Hours) {
      const { error: deleteError } = await supabase
        .from('vendor_permanent_availability')
        .delete()
        .eq('mobile_no', vendor.mobile_no)
        .eq('name', vendor.name)
        .neq('slot_type', '24hours')

      if (deleteError) {
        console.error('Delete error for vendor:', vendor.mobile_no, deleteError)
        return { success: false, error: deleteError.message }
      }

      cleanedCount++
    }

    return { success: true, cleanedCount }
  } catch (error: any) {
    console.error('Cleanup error:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
} 