import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { User } from '@supabase/supabase-js' 
import { 
  Users, Sprout, Briefcase, Package, CheckCircle, XCircle 
} from "lucide-react"

import StatsGrid from '@/components/StatsGrid'
import DonutStatCard from '@/components/DonutStatCard'
import PopularEquipment from '../components/PopularEquipment'
import StatisticsChart from '@/components/Analytics'
import RecentReviews from '../components/RecentReviews'
import { Skeleton } from "@/components/ui/skeleton"

import { 
  fetchAdminStats, 
  fetchLenderStats, 
  fetchUserGrowthData,
  fetchRecentReviewsWithLocation,
  fetchPopularEquipment,
  fetchRentalGrowthData,
  SingleReview
} from '@/lib/overview-actions'
interface ChartDataPoint {
  month: string
  [key: string]: string | number
}

export default async function Overview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role || 'farmer'
  const isAdmin = userRole === 'admin'
  const name = user.user_metadata?.username || user.email?.split('@')[0]

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <main className="flex-1 p-6">
    
        <div className="mb-8"> 
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold">{name}</span>! 
            {isAdmin 
              ? " Here's the platform overview." 
              : " Here's what's happening with your equipment rentals."}
          </p>
        </div>

        <div className="mb-8">
          <Suspense fallback={<StatsGridSkeleton />}>
            <StatsSection user={user} isAdmin={isAdmin} />
          </Suspense>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Suspense fallback={<Skeleton className="h-[300px] lg:col-span-2 rounded-xl" />}>
            <AnalyticsSection user={user} isAdmin={isAdmin} />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-[300px] rounded-xl" />}>
            <DonutSection user={user} isAdmin={isAdmin} />
          </Suspense>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense fallback={<Skeleton className="h-[400px] rounded-xl" />}>
            <PopularEquipmentSection />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-[400px] rounded-xl" />}>
            <ReviewsSection />
          </Suspense>
        </div>

      </main>
    </div>
  )
}

async function StatsSection({ user, isAdmin }: { user: User, isAdmin: boolean }) {
  let stats = []

  if (isAdmin) {
    const { totalAccounts, farmers, lenders } = await fetchAdminStats()
    stats = [
      { title: "Active Accounts", value: totalAccounts.toLocaleString(), description: "Total registered users", icon: Users, iconColor: "text-gray-500" },
      { title: "Farmers", value: farmers.toLocaleString(), description: "Agricultural producers", icon: Sprout, iconColor: "text-green-600" },
      { title: "Lenders", value: lenders.toLocaleString(), description: "Equipment providers", icon: Briefcase, iconColor: "text-blue-600" }
    ]
  } else {
    const { totalRentals, approved, rejected, totalEquipment } = await fetchLenderStats(user.id)
    stats = [
      { title: "Total Rentals", value: totalRentals.toLocaleString(), description: "Total transactions", icon: Briefcase, iconColor: "text-gray-500" },
      { title: "Approved", value: approved.toLocaleString(), description: "Approved requests", icon: CheckCircle, iconColor: "text-green-500", valueColor: "text-green-600" },
      { title: "Rejected", value: rejected.toLocaleString(), description: "Rejected requests", icon: XCircle, iconColor: "text-red-500", valueColor: "text-red-600" },
      { title: "Total Equipment", value: totalEquipment.toLocaleString(), description: "Owned assets", icon: Package, iconColor: "text-blue-500" }
    ].slice(0, 3) 
  }

  return <StatsGrid stats={stats} />
}

async function AnalyticsSection({ user, isAdmin }: { user: User, isAdmin: boolean }) {
  let chartData: ChartDataPoint[] = []
  let chartConfig = { title: "", dataKey: "", color: "" }

  if (isAdmin) {
    const result = await fetchUserGrowthData(6)
    chartData = result.data as ChartDataPoint[]
    chartConfig = { title: "Platform Growth (New Users)", dataKey: "users", color: "#10b981" }
  } else {
    const result = await fetchRentalGrowthData(user.id, 6)
    chartData = result.data as unknown as ChartDataPoint[]
    chartConfig = { title: "Monthly Rentals", dataKey: "rentals", color: "hsl(var(--primary))" }
  }

  return (
    <StatisticsChart 
      data={chartData} 
      title={chartConfig.title} 
      dataKey={chartConfig.dataKey}
      color={chartConfig.color}
    />
  )
}

async function DonutSection({ user, isAdmin }: { user: User, isAdmin: boolean }) {
  if (isAdmin) {
    const { totalAccounts } = await fetchAdminStats()
    return (
      <DonutStatCard 
        title="Total User Base"
        value={totalAccounts || 0}
        label="Active Users"
        icon={Users}
        color="#10b981" 
      />
    )
  } else {
    const { totalEquipment } = await fetchLenderStats(user.id)
    return (
      <DonutStatCard 
        title="Total Equipment"
        value={totalEquipment || 0}
        label="Equipment"
        icon={Package}
        color="var(--nav-bg)" 
      />
    )
  }
}

async function PopularEquipmentSection() {
  const { popular } = await fetchPopularEquipment()

  const formattedData = (popular || []).map(item => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    rental_count: item.rental_count,
    average_rating: item.average_rating,
    total_reviews: item.total_reviews,
  }))


  return <PopularEquipment equipment={formattedData} />
}

async function ReviewsSection() {
  const { reviews } = await fetchRecentReviewsWithLocation()
  return <RecentReviews reviews={(reviews as SingleReview[]) || []} />
}

function StatsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  )
}