'use server'

import { createClient } from '@/utils/supabase/server'

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
  address: string | null;
};

export type FormattedUser = {
  id: string;
  name: string;
  email: string;
  date: string;
  location: string;
  role: string;
  roleText: string;
};

export type FetchUsersResponse = {
  data: FormattedUser[];
  total: number;
  error: string | null;
};

const ITEMS_PER_PAGE = 10;

export async function fetchDashboardUsers(
  page: number = 1,
  search: string = '',
  roleFilter: string = 'all',
  selectFields: string = 'id,first_name,last_name,email,role,created_at,address' 
): Promise<FetchUsersResponse> {
  const supabase = await createClient();

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  const searchLower = search.trim().toLowerCase();

  let query = supabase
    .from('profiles')
    .select(selectFields, { count: 'exact' })
    .neq('role', 'admin'); 

  if (roleFilter !== 'all') {

    let dbRole = roleFilter;
    if (roleFilter === 'renter') {
        dbRole = 'farmer'; 
    } 
    query = query.eq('role', dbRole);
  }

  if (searchLower) {
    query = query.or(`first_name.ilike.%${searchLower}%,last_name.ilike.%${searchLower}%,email.ilike.%${searchLower}%,address.ilike.%${searchLower}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching users:', error);
    return { data: [], total: 0, error: error.message };
  }

  const formattedData: FormattedUser[] = ((data as unknown as Profile[]) || []).map(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    const role = user.role || 'unknown';

    let roleDisplay = role;
    if (role === 'farmer') roleDisplay = 'Renter'; 

    return {
      id: user.id,
      name: fullName || 'Unknown User',
      email: user.email || 'No email',
      date: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
      location: user.address || 'N/A',
      role: role,
      roleText: role.charAt(0).toUpperCase() + role.slice(1) 
    };
  });

  return { 
    data: formattedData, 
    total: count || 0, 
    error: null 
  };
}

export async function fetchDashboardRentals(
  page: number = 1,
  search: string = '',
  statusFilter: string = 'all'
) {
  const supabase = await createClient()
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], total: 0, error: 'Unauthorized' }

  let query = supabase
    .from('rentals')
    .select(`
      id, 
      start_date, 
      end_date, 
      status, 
      equipment:equipment_id!inner ( name, user_id ), 
      renter:renter_id ( first_name, last_name, email, address )
    `, { count: 'exact' })
    .eq('equipment.user_id', user.id) 
    .order('created_at', { ascending: false })
    .range(from, to)

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  interface RentalDBResponse {
    id: string;
    start_date: string;
    end_date: string;
    status: string;
    equipment: { name: string; user_id: string } | null; 
    renter: { first_name: string; last_name: string; email: string; address: string | null } | null;
  }

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching rentals:', error)
    return { data: [], total: 0, error: error.message }
  }

  const formattedData = ((data as unknown as RentalDBResponse[]) || []).map((item) => {
    const startDate = new Date(item.start_date)
    const endDate = new Date(item.end_date)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const renter = item.renter;
    const equipment = item.equipment;
    
    const renterName = renter 
      ? `${renter.first_name || ''} ${renter.last_name || ''}`.trim() 
      : 'Unknown Renter';

    return {
      id: item.id,
      name: renterName || 'Unknown',
      equipment: equipment?.name || 'Unknown Equipment',
      date: startDate.toLocaleDateString(),
      duration: `${diffDays} days`,
      location: renter?.address || 'N/A',
      email: renter?.email || 'N/A',
      status: item.status,
      statusText: item.status.charAt(0).toUpperCase() + item.status.slice(1)
    }
  })

  return { data: formattedData, total: count || 0 }
}
export async function deleteUserAccount() {
  const supabase = await createClient()

  // 1. Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: "Unauthorized" }
  }
  const { error } = await supabase.rpc('delete_user_account')
  await supabase.auth.signOut()

  return { success: true }
}

export type UserDetails = {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
  address: string | null;
  contact_number: string | null;
  avatar_url: string | null;
  subscription: string | null;
};

export async function getUserDetails(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as UserDetails, error: null };
}
