'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface RentalRequestData {
  delivery: string;
  returnLocation: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  message: string;
  contact_number: string;
  first_name:string;
  last_name: string;
  email: string;
}

export async function submitRentalRequest(
  formData: RentalRequestData, 
  equipmentId: string, 
  ownerId: string
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in to request a rental." }
  }
  const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString()
  const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString()
  const { error } = await supabase
    .from('rentals')
    .insert({
        renter_id: user.id,
        equipment_id: equipmentId,
        status: 'pending',
        start_date: startDateTime,
        end_date: endDateTime,
        deliver_at: formData.delivery, 
        return_at: formData.returnLocation,
        message: formData.message,
        owner_id: ownerId
    })

  if (error) {
    console.error("Rental Request Error:", error)
    return { error: "Failed to submit request. Please try again." }
  }

  revalidatePath('/dashboard/rent')
  
  return { success: true }
}