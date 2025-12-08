'use client'

import { useUserData } from "@/lib/user-data";
import { 
  Users, 
  Sprout, 
  Briefcase, 
  Package, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

// Components
import StatsGrid, { StatItem } from '@/components/StatsGrid';
import DonutStatCard from '@/components/DonutStatCard';
import PopularEquipment from '../components/PopularEquipment';
import StatisticsChart from '@/components/Analytics'; // Ensure this matches the updated component above
import RecentReviews from '../components/RecentReviews';
import { Skeleton } from "@/components/ui/skeleton";

// ... existing equipment and reviews arrays ...
const popularEquipment = [
  { id: 1, name: "Rice Harvester", brand: "Lowol", rentedCount: "2.5k", ratings: 4.5, ratingCount: "4.5k", image: "/api/placeholder/80/80" },
  { id: 2, name: "Tractor", brand: "John Deere", rentedCount: "1.8k", ratings: 4.7, ratingCount: "3.2k", image: "/api/placeholder/80/80" },
  { id: 3, name: "Irrigation System", brand: "Rain Bird", rentedCount: "1.2k", ratings: 4.3, ratingCount: "2.1k", image: "/api/placeholder/80/80" }
];

const recentReviews = [
  { id: 1, name: "John Doe", location: "Philippines", date: "2026-05-01", rating: 5, comment: "Nice product...", avatar: "/api/placeholder/40/40" },
  { id: 2, name: "John Farmer", location: "Philippines", date: "2027-05-01", rating: 5, comment: "High quality...", avatar: "/api/placeholder/40/40" },
  { id: 3, name: "Maria Santos", location: "Philippines", date: "2026-08-15", rating: 4, comment: "Timely delivery...", avatar: "/api/placeholder/40/40" }
];


// IMPROVED: Added 'users' to simulate Admin data in the same object
const chartData = [
  { month: 'Jan', rentals: 40, revenue: 2400, users: 120 },
  { month: 'Feb', rentals: 30, revenue: 1398, users: 135 },
  { month: 'Mar', rentals: 98, revenue: 2000, users: 160 },
  { month: 'Apr', rentals: 39, revenue: 2780, users: 210 },
  { month: 'May', rentals: 48, revenue: 1890, users: 255 },
];

export default function Overview() {
  const { user, loading } = useUserData();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const role = user?.app_metadata?.role as 'admin' | 'lender';
  const name = user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0];
  const isAdmin = role === 'admin';

  // ... existing adminStats and lenderStats ...
  const adminStats: StatItem[] = [
    { title: "Active Accounts", value: "1,895", description: "Total registered users", icon: Users, iconColor: "text-gray-500" },
    { title: "Farmers", value: "1,290", description: "Agricultural producers", icon: Sprout, iconColor: "text-green-600" },
    { title: "Lenders", value: "605", description: "Equipment providers", icon: Briefcase, iconColor: "text-blue-600" }
  ];

  const lenderStats: StatItem[] = [
    { title: "Total Rentals", value: "7,265", description: "+20.1% from last month", icon: Package, iconColor: "text-gray-500" },
    { title: "Approved", value: "203", description: "This month", icon: CheckCircle, iconColor: "text-green-500", valueColor: "text-green-600" },
    { title: "Rejected", value: "305", description: "This month", icon: XCircle, iconColor: "text-red-500", valueColor: "text-red-600" }
  ];

  const currentStats = isAdmin ? adminStats : lenderStats;

  // --- NEW: LOGIC TO CONFIGURE CHART BASED ON ROLE ---
  const chartConfig = isAdmin 
    ? { title: "Platform Growth (New Users)", dataKey: "users", color: "#10b981" } // Green for Admin
    : { title: "Monthly Rentals", dataKey: "rentals", color: "hsl(var(--primary))" }; // Primary for Lender

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
          
          {/* --- IMPROVED USAGE --- */}
          <StatisticsChart 
            data={chartData} 
            title={chartConfig.title} 
            dataKey={chartConfig.dataKey}
            color={chartConfig.color}
          />
          
          {!isAdmin && (
            <DonutStatCard 
                title="Total Customers"
                value={7265}
                label="Customers"
                icon={Users}
                color="var(--nav-bg)" 
            />
          )}
          {isAdmin && (
            <DonutStatCard 
                title="Total User Base"
                value={1895}
                label="Active Users"
                icon={Users}
                growthPercentage={5.4}
                color="#10b981" 
            />
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PopularEquipment equipment={popularEquipment} />
          <RecentReviews reviews={recentReviews} />
        </div>

      </main>
    </div>
  )
}