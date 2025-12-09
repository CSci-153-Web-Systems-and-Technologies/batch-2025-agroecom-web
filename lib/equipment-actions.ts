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

  if (filters.sort === 'price') {
    query = query.order('rate', { ascending: true })
  } else if (filters.sort === 'newest') {
    query = query.order('added_at', { ascending: false })
  } else {
    query = query.order('added_at', { ascending: false })
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

export async function addEquipment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to add equipment')
  }

  const imageFile = formData.get('image') as File
  let publicUrl = null

  if (imageFile && imageFile.size > 0) {

    const fileName = `${Date.now()}-${imageFile.name.replaceAll(' ', '_')}`
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('equipment-images') 
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, message: 'Failed to upload image' }
    }

    const { data: urlData } = supabase
      .storage
      .from('equipment-images')
      .getPublicUrl(fileName)
      
    publicUrl = urlData.publicUrl
  }

  const newEquipment = {
    name: formData.get('name') as string,
    model: formData.get('model') as string,
    rate: Number(formData.get('rate')),
    description: formData.get('description') as string,
    delivery: formData.get('delivery') as string,
    type_id: formData.get('type_id') as string,
    user_id: user.id,
    image_url: publicUrl, 
  }

  const { error } = await supabase.from('equipment').insert(newEquipment)

  if (error) {
    console.error('Error adding equipment:', error)
    return { success: false, message: 'Failed to add equipment to database' }
  }

  revalidatePath('/dashboard/equipment')
  return { success: true, message: 'Equipment added!' }
}