'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { signout } from './auth-actions'
import { formatDistanceToNow } from 'date-fns'

export async function getAccountDetails() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('created_at, role, subscription')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    return { error: 'Failed to fetch account details' }
  }

  let accountAge = 'Just joined'
  
  if (profile.created_at) {
    let dateStr = profile.created_at;

    dateStr = dateStr.replace(' ', 'T');
    if (!dateStr.endsWith('Z') && !dateStr.includes('+')) {
        dateStr += 'Z';
    }

    const createdDate = new Date(dateStr);
    accountAge = formatDistanceToNow(createdDate, { addSuffix: true })
  }

  return {
    success: true,
    data: {
      role: profile.role || 'User',
      accountAge: accountAge,
      subscription: profile.subscription || 'free'
    }
  }
}

export async function changeUserPassword(oldPassword: string, newPassword: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return { error: 'User not authenticated' }
  }

  if (newPassword.length < 6) {
    return { error: 'New password must be at least 6 characters' }
  }

  if (oldPassword === newPassword) {
    return { error: 'New password must be different from old password' }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  })

  if (signInError) {
    return { error: 'Incorrect old password' }
  }
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (updateError) {
    return { error: updateError.message }
  }

  await signout()
  return { success: true, message: 'Password changed successfully. Please log in with your new password.' }
}