'use server'

import { createClient } from '@/utils/supabase/server'

export interface AdminStatsCounts {
  totalAccounts: number;
  farmers: number;
  lenders: number;
  error: string | null;
}

export interface LenderStatsCounts {
  totalRentals: number;
  approved: number;
  rejected: number;
  error: string | null;
}

export async function fetchAdminStats(): Promise<AdminStatsCounts> {
  const supabase = await createClient();
  
  try {
    const { count: totalAccounts, error: totalError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true }); 

    if (totalError) {
      console.error("Error fetching total accounts:", totalError);
      throw new Error(totalError.message);
    }

    const { count: farmers, error: farmersError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'farmer');

    if (farmersError) {
      console.error("Error fetching farmer accounts:", farmersError);
      throw new Error(farmersError.message);
    }

    const { count: lenders, error: lendersError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'lender');

    if (lendersError) {
      console.error("Error fetching lender accounts:", lendersError);
      throw new Error(lendersError.message);
    }

    return {
      totalAccounts: totalAccounts || 0,
      farmers: farmers || 0,
      lenders: lenders || 0,
      error: null
    };

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return {
      totalAccounts: 0,
      farmers: 0,
      lenders: 0,
      error: errorMessage
    };
  }
}

export interface LenderStatsCounts {
  totalEquipment: number; 
  totalRentals: number;
  approved: number;
  rejected: number;
  error: string | null;
}

export async function fetchLenderStats(userId: string): Promise<LenderStatsCounts> {
  const supabase = await createClient();
  
  try {
    const [equipmentCount, rentalCount, approved, rejected, pending] = await Promise.all([
      supabase
        .from('equipment')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),

      supabase
        .from('rentals')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId),
        
      supabase
        .from('rentals')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', userId)
        .eq('status', 'approved'),

      supabase
        .from('rentals')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', userId)
        .eq('status', 'rejected'),

      supabase
        .from('rentals')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', userId)
        .eq('status', 'pending')
    ]);

    if (equipmentCount.error) throw new Error(`Equipment count error: ${equipmentCount.error.message}`);
    if (rentalCount.error) throw new Error(`Total rentals error: ${rentalCount.error.message}`);
    if (approved.error) throw new Error(`Approved rentals error: ${approved.error.message}`);
    if (rejected.error) throw new Error(`Rejected rentals error: ${rejected.error.message}`);

    return {
      totalEquipment: equipmentCount.count || 0,
      totalRentals: rentalCount.count || 0, 
      approved: approved.count || 0,
      rejected: rejected.count || 0,
      error: null
    };

  } catch (e) {
    console.error("Error fetching lender stats:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return {
      totalEquipment: 0,
      totalRentals: 0, 
      approved: 0,
      rejected: 0,
      error: errorMessage
    };
  }
}

export interface MonthlyUserData {
  month: string;
  users: number;
  [key: string]: string | number;
}

export interface UserGrowthData {
  data: MonthlyUserData[];
  error: string | null;
}

export async function fetchUserGrowthData(months: number = 6): Promise<UserGrowthData> {
  const supabase = await createClient();
  
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1); 
    startDate.setHours(0, 0, 0, 0);

    const { data: users, error } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching user growth data:", error);
      throw new Error(error.message);
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: Record<string, number> = {};

    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - months + 1 + i);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyData[key] = 0;
    }

    users?.forEach(user => {
      if (user.created_at) {
        const date = new Date(user.created_at);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (key in monthlyData) {
          monthlyData[key]++;
        }
      }
    });

    const chartData: MonthlyUserData[] = Object.entries(monthlyData).map(([key, count]) => {
      const [, month] = key.split('-').map(Number);
      return {
        month: monthNames[month],
        users: count
      };
    });

    return {
      data: chartData,
      error: null
    };

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return {
      data: [],
      error: errorMessage
    };
  }
}

export interface MonthlyRentalData {
  month: string;
  rentals: number; 
}

export interface RentalGrowthResult {
  data: MonthlyRentalData[];
  error: string | null;
}


export async function fetchRentalGrowthData(ownerId: string, months: number = 6): Promise<RentalGrowthResult> {
  const supabase = await createClient();
  
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1); 
    startDate.setHours(0, 0, 0, 0);

    const { data: rentalRecords, error } = await supabase
      .from('rentals')
      .select('created_at')
      .eq('owner_id', ownerId) 
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching rental growth data:", error);
      throw new Error(error.message);
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: Record<string, number> = {};

    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - months + 1 + i);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyData[key] = 0;
    }

    rentalRecords?.forEach(record => {
      if (record.created_at) {
        const date = new Date(record.created_at);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (key in monthlyData) {
          monthlyData[key]++;
        }
      }
    });

    const chartData: MonthlyRentalData[] = Object.entries(monthlyData).map(([key, count]) => {
      const [, monthIndex] = key.split('-').map(Number);
      return {
        month: monthNames[monthIndex], 
        rentals: count 
      };
    });

    return {
      data: chartData,
      error: null
    };

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    return {
      data: [],
      error: errorMessage
    };
  }
}

export interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  address: string | null;
}

export interface SingleReview {
  id: string; 
  rating_count: number | null; 
  comment: string; 
  created_at: string;  
  profiles: ProfileData | null; 
}

export interface ReviewQueryResult {
    reviews: SingleReview[];
    error: string | null;
}

export async function fetchRecentReviewsWithLocation(): Promise<ReviewQueryResult> {
  const supabase = await createClient();

 const { data, error } = await supabase
  .from('reviews')
  .select(`
      id, 
      comment,
      created_at,
      rating_count,
      user_id,
      profiles ( 
        first_name, 
        last_name, 
        avatar_url,
        address
      )
    `)
    .not('comment', 'is', null)
    .limit(3) 
    .order('created_at', { ascending: false }); 

  if (error) {
    console.error('Error fetching reviews:', error.message);
    return { 
          reviews: [], 
          error: error.message 
      };
    }

  return { 
        reviews: data as unknown as SingleReview[], 
        error: null 
    };
}

interface ReviewItem {
  id: string; 
  rating_count: number | null; 
}

interface RawEquipment {
  id: string; 
  name: string;
  model: string | null;
  rental_count: number | null;
  reviews: ReviewItem[]; 
}

export interface PopularEquipmentRaw {
  id: string; 
  name: string;
  brand: string;
  rental_count: string;
  review: ReviewItem | null; 
  average_rating: number; 
  total_reviews: number;
}

export interface PopularEquipmentResult {
  popular: PopularEquipmentRaw[];
  error: string | null;
}

export async function fetchPopularEquipment(): Promise<PopularEquipmentResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('equipment')
    .select(`
      id, 
      name,
      model,
      rental_count,
      reviews ( 
        id,
        rating_count
      )
    `)
    .order('rental_count', { ascending: false, nullsFirst: false }) 
    .limit(3);

  if (error) {
    console.error('Error fetching popular equipment:', error.message);
    return { popular: [], error: error.message };
  }

  if (!data) {
    return { popular: [], error: null };
  }

  const rawData = data as unknown as RawEquipment[];

  const formattedData: PopularEquipmentRaw[] = rawData.map((item) => {
    const ratings = item.reviews || [];  
    const totalReviews = ratings.length;
    
    const sumRatings = ratings.reduce((sum, r) => sum + (r.rating_count || 0), 0);
    const avgRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

    return {
        id: item.id,
        name: item.name,
        brand: item.model || 'Unknown Brand',
        rental_count: String(item.rental_count ?? '0'), 
        review: ratings.length > 0 ? ratings[0] : null, 
        total_reviews: totalReviews,
        average_rating: parseFloat(avgRating.toFixed(1)) 
      };
    });

  return { 
    popular: formattedData, 
    error: null 
  };
}