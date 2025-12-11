'use client'

import { useState, useEffect } from 'react'
import { useUserData } from "@/lib/user-data";
import { 
  Users, 
  Sprout, 
  Briefcase, 
  Package, 
  CheckCircle, 
  XCircle,
} from "lucide-react";

import StatsGrid from '@/components/StatsGrid';
import { StatItem } from '@/types';
import DonutStatCard from '@/components/DonutStatCard';
import PopularEquipment from '../components/PopularEquipment';
import StatisticsChart from '@/components/Analytics';
import RecentReviews from '../components/RecentReviews';
import { Skeleton } from "@/components/ui/skeleton";
import { 
  fetchAdminStats, 
  fetchLenderStats, 
  fetchUserGrowthData,
  fetchRecentReviewsWithLocation,
  fetchPopularEquipment,
  fetchRentalGrowthData,
  MonthlyUserData,
  MonthlyRentalData, 
  SingleReview,
  PopularEquipmentRaw as PopularEquipmentType,
} from '@/lib/overview-actions';

interface ChartDataPoint {
  month: string
  [key: string]: string | number
}

export default function Overview() {
  const { user, loading } = useUserData();
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [adminStats, setAdminStats] = useState<StatItem[]>([]);
  const [lenderStats, setLenderStats] = useState<StatItem[]>([]);
  
  const [chartData, setChartData] = useState<MonthlyUserData[] | MonthlyRentalData[]>([]);
  
  const [recentReviews, setRecentReviews] = useState<SingleReview[]>([]);
  const [popularEquipData, setPopularEquipData] = useState<PopularEquipmentType[]>([]);

  const isAdmin = user?.app_metadata?.role === 'admin';

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      
      setStatsLoading(true);

      const [reviewsResult, popularResult] = await Promise.all([
        fetchRecentReviewsWithLocation(),
        fetchPopularEquipment()
      ]);

      if (!reviewsResult.error && reviewsResult.reviews) {
        setRecentReviews(reviewsResult.reviews);
      }

      if (!popularResult.error && popularResult.popular) {
        setPopularEquipData(popularResult.popular);
      }
      
      if (isAdmin) {
        const [statsData, growthData] = await Promise.all([
          fetchAdminStats(),
          fetchUserGrowthData(6)
        ]);
        
        if (!statsData.error) {
          setAdminStats([
            { title: "Active Accounts", value: statsData.totalAccounts.toLocaleString(), description: "Total registered users", icon: Users, iconColor: "text-gray-500" },
            { title: "Farmers", value: statsData.farmers.toLocaleString(), description: "Agricultural producers", icon: Sprout, iconColor: "text-green-600" },
            { title: "Lenders", value: statsData.lenders.toLocaleString(), description: "Equipment providers", icon: Briefcase, iconColor: "text-blue-600" }
          ]);
        }
        
        if (!growthData.error) {
          setChartData(growthData.data);
        }
      } else {

        const [lenderStatsData, rentalGrowthData] = await Promise.all([
          fetchLenderStats(user.id),
          fetchRentalGrowthData(user.id, 6) 
        ]);

        if (!lenderStatsData.error) {
          setLenderStats([
            { 
              title: "Total Rentals", 
              value: lenderStatsData.totalRentals.toLocaleString(), 
              description: "Total transactions", 
              icon: Briefcase, 
              iconColor: "text-gray-500" 
            },
            { 
              title: "Approved", 
              value: lenderStatsData.approved.toLocaleString(), 
              description: "Approved requests", 
              icon: CheckCircle, 
              iconColor: "text-green-500", 
              valueColor: "text-green-600" 
            },
            { 
              title: "Rejected", 
              value: lenderStatsData.rejected.toLocaleString(), 
              description: "Rejected requests", 
              icon: XCircle, 
              iconColor: "text-red-500", 
              valueColor: "text-red-600" 
            },

            {
                title: "Total Equipment",
                value: lenderStatsData.totalEquipment.toLocaleString(),
                description: "Owned assets",
                icon: Package,
                iconColor: "text-blue-500"
            }
          ]);
        }

        if (!rentalGrowthData.error) {
            setChartData(rentalGrowthData.data);
        }
      }
      
      setStatsLoading(false);
    }
    
    if (!loading && user) {
      loadStats();
    }
  }, [user, loading, isAdmin]);

  if (loading || statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const name = user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0];
  const currentStats = isAdmin ? adminStats : lenderStats.slice(0, 3);

  const chartConfig = isAdmin 
    ? { title: "Platform Growth (New Users)", dataKey: "users", color: "#10b981" } 
    : { title: "Monthly Rentals", dataKey: "rentals", color: "hsl(var(--primary))" }; 

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
          <StatsGrid stats={currentStats} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          
          <StatisticsChart 
            data={chartData as unknown as ChartDataPoint[]} 
            title={chartConfig.title} 
            dataKey={chartConfig.dataKey}
            color={chartConfig.color}
          />
          
          {!isAdmin && lenderStats && (
            <DonutStatCard 
                title="Total Equipment"
                value={lenderStats.find(s => s.title === "Total Equipment")?.value || 0}
                label="Equipment"
                icon={Package}
                color="var(--nav-bg)" 
            />
          )}
          {isAdmin && adminStats && (
            <DonutStatCard 
                title="Total User Base"
                value={adminStats.find(s => s.title === "Active Accounts")?.value || 0}
                label="Active Users"
                icon={Users}
                color="#10b981" 
            />
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PopularEquipment popular={popularEquipData} />
          
          <RecentReviews reviews={recentReviews} />
        </div>
      </main>
    </div>
  )
}