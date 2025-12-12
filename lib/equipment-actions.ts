'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type EquipmentFilters = {
  location?: string
  type?: string
  view?: string 
  search?: string
  sort?: string
  page?: number
  limit?: number
}

export async function getEquipmentList(filters: EquipmentFilters = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('equipment')
    .select(`
      *,
      equipment_types ( name ) 
    `, { count: 'exact' })

  if (filters.location && filters.location !== 'all') {
    query = query.ilike('location', `%${filters.location}%`) 
  }

  if (filters.type && filters.type !== 'all') {
    query = query.eq('type_id', filters.type) 
  }

  if (filters.view === 'my-equipment') {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      query = query.eq('user_id', user.id)
    } else {
      return { data: [], count: 0 }
    }
  }

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  if (filters.sort === 'price_asc') {
    query = query.order('rate', { ascending: true })
  } else if (filters.sort === 'price_desc') {
    query = query.order('rate', { ascending: false })
  } else if (filters.sort === 'newest') {
    query = query.order('added_at', { ascending: false })
  } else {
    query = query.order('rental_count', { ascending: false, nullsFirst: false })
  }
  const page = filters.page || 1
  const limit = filters.limit || 4
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching equipment:', error)
    return { data: [], count: 0 }
  }

  return { data, count: count || 0 }
}

export async function getEquipmentTypes() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('equipment_types')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching equipment types:', error)
    return []
  }

  return data
}

export async function getEquipmentTypeById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('equipment_types')
    .select('id, name')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching equipment type:', error)
    return null
  }

  return data
}

export async function getEquipmentImageById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('equipment')
    .select('name, image_url')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching equipment image:', error)
    return null
  }
  console.log(data)
  return data
}

export async function getEquipmentById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('equipment')
    .select(`
      name,
      rate,
      model,
      delivery,
      location,
      rental_count,
      description,
      user_id,
      profiles ( 
        first_name,
        last_name
      ),
      reviews (
        rating_count
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching equipment details:', error)
    return null
  }

  const reviews = data.reviews || [];
  const totalReviews = reviews.length;
  
  const sumRatings = reviews.reduce((acc: number, curr: { rating_count: number }) => {
    return acc + (curr.rating_count || 0);
  }, 0);

  const averageRating = totalReviews > 0 ? (sumRatings / totalReviews) : 0;

  return {
    name: data.name,      
    rate: data.rate,          
    model: data.model,       
    delivery: data.delivery, 
    description: data.description, 
    location: data.location,
    rental_count: data.rental_count,
    average_rating: parseFloat(averageRating.toFixed(1)), 
    total_reviews: totalReviews,
    users: data.profiles,
    user_id: data.user_id 
  };
}

export async function updateEquipment(
  equipmentId: string,
  updates: {
    name?: string;
    model?: string;
    description?: string;
    delivery?: string;
    rate?: number;
    location?: string;
  }
) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: 'You must be logged in to update equipment' }
  }

  const { data: equipment } = await supabase
    .from('equipment')
    .select('user_id')
    .eq('id', equipmentId)
    .single()

  if (!equipment || equipment.user_id !== user.id) {
    return { success: false, error: 'You do not have permission to edit this equipment' }
  }

  const { data, error } = await supabase
    .from('equipment')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', equipmentId)
    .select()
    .single()

  if (error) {
    console.error('Error updating equipment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/equipment/rent/${equipmentId}`)
  revalidatePath('/equipment')
  revalidatePath('/dashboard/equipment')
  return { success: true, data }
}

export async function addEquipment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized: You must be logged in.' }
  }

  const name = formData.get('name') as string
  const model = formData.get('model') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const delivery = formData.get('delivery') as string 
  const typeId = formData.get('type_id') as string
  const rateStr = formData.get('rate') as string

  if (!name || !model || !location || !rateStr || !typeId) {
    return { success: false, message: 'Please fill in all required fields.' }
  }

  const rate = Number(rateStr)
  if (isNaN(rate) || rate < 0) {
    return { success: false, message: 'Invalid rate provided.' }
  }

  const imageEntry = formData.get('image')
  const imageFile = imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null
  
  let publicUrl = null
  let uploadedPath = null 

  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase
      .storage
      .from('equipment-images') 
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, message: `Image upload failed: ${uploadError.message}` } 
    }

    uploadedPath = fileName

    const { data: urlData } = supabase
      .storage
      .from('equipment-images')
      .getPublicUrl(fileName)
      
    publicUrl = urlData.publicUrl
  }
  
  const newEquipment = {
    name,
    model,
    rate,
    description,
    delivery, 
    type_id: typeId,
    user_id: user.id,
    image_url: publicUrl, 
    location,
    rental_count: 0
  }

  const { data: insertedData, error: dbError } = await supabase
    .from('equipment')
    .insert(newEquipment)
    .select() 
    .single()

  if (dbError) {
    console.error('Database error adding equipment:', dbError)

    if (uploadedPath) {
      await supabase.storage.from('equipment-images').remove([uploadedPath])
    }

    return { success: false, message: `Failed to save equipment: ${dbError.message}` }
  }

  revalidatePath('/equipment') 
  revalidatePath('/dashboard/equipment')
  return { 
    success: true, 
    message: 'Equipment added successfully!', 
    equipment: insertedData || newEquipment 
  }
}

export async function postReview(reviewData: {
  equipment_id: string;
  rating_count: number;
  comment: string;
}) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { success: false, error: 'You must be logged in to submit a review' }
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      equipment_id: reviewData.equipment_id,
      rating_count: reviewData.rating_count,
      comment: reviewData.comment,
    })
    .select()
    .single()

  if (error) {
    console.error('Error posting review:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/equipment/${reviewData.equipment_id}`)
  revalidatePath('/equipment')
  return { success: true, data }
}

export async function getEquipmentReviews(
  equipmentId: string, 
  page: number = 1, 
  limit: number = 4
) {
  const supabase = await createClient()
  
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('reviews')
    .select(`
      id,
      user_id,
      equipment_id,
      rating_count,
      comment,
      created_at,
      users:user_id (
        first_name,
        last_name,
        address,
        avatar_url
      )
    `, { count: 'exact' }) 
    .eq('equipment_id', equipmentId)
    .order('created_at', { ascending: false })
    .range(from, to) 

  if (error) {
    console.error('Error fetching reviews:', error)
    return { data: [], count: 0 }
  }

  return { data, count }
}

interface Review {
  id: string
  rating: number
  comment?: string
}

interface Equipment {
  name: string | null
  model: string | null
  delivery: string | null
  rate: string | null
  description: string | null
  image_url: string | null
  rental_count: string
  reviews?: Review[]
}

interface RenterProfile {
  first_name: string
  last_name: string
  email: string
  contact_number: string | null
  avatar_url: string | null 
}

interface Owner {
  first_name: string
  last_name: string
  avatar_url: string | null
}

export interface RentalRequest {
  id: string
  renter_id: string
  owner_id: string
  equipment_id: string
  deliver_at: string
  return_at: string  
  start_date: string
  end_date: string
  message: string | null
  status: string | 'pending'
  owner: Owner | null
  renter: RenterProfile | null
  equipment: Equipment | null
}

export async function getEquipmentRentalInfo(rentalId: string): Promise<RentalRequest[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rentals')
    .select(`
      id,
      renter_id,
      owner_id,
      equipment_id,
      deliver_at,
      return_at,
      start_date,
      end_date,
      message,
      status,
      owner:owner_id (
        first_name,
        last_name,
        avatar_url
      ),
      renter:profiles!renter_id (
        first_name,
        last_name,
        email,
        contact_number,
        avatar_url
      ),
      equipment:equipment_id (
        name,
        model, 
        rate,
        delivery,
        description,
        image_url,
        rental_count,
        reviews (
            id,
            rating_count
        )
      )
    `)
    .eq('id', rentalId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rental info:', error)
    return []
  }
  
  return data as unknown as RentalRequest[]
}

export async function approveRental(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rentals')
    .update({ status: 'approved' }) 
    .eq('id', id)
    .select() 
    .maybeSingle()

  if (error) {
    console.error('Error approving rental:', error)
    return null 
  }

  return data
}

export async function rejectRental(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rentals')
    .update({ status: 'rejected' }) 
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error rejecting rental:', error)
    return null
  }

  return data
}
