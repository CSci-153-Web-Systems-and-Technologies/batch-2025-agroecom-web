import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardIndex() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  const role = user.user_metadata?.role || 'farmer'

  if (role === 'farmer') {
    redirect('/dashboard/farmer/profile')
  }
  
  redirect('/dashboard/overview')
}