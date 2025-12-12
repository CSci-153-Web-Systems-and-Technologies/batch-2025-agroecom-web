'use server'

import { createClient } from '@supabase/supabase-js' 
import { revalidatePath } from 'next/cache'

export async function adminDeleteUser(userId: string) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY is missing.')
    return { error: 'Server configuration error: Missing Service Key' }
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Supabase Auth Delete Error:', error)
      return { error: error.message }
    }
    revalidatePath('/dashboard/admin')
    return { error: null }

  } catch (error) {
    console.error('Unexpected error deleting user:', error)
    return { error: 'An unexpected error occurred' }
  }
}