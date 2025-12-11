'use client'

import { ReactNode } from "react"
import SideBar from "@/components/app-sidebar" 
import { useUserData } from '@/lib/user-data'
interface DashboardLayoutProps {
    children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user } = useUserData()
    
    const userRole = user?.app_metadata?.role
    const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'

    return (
    <div className="flex min-h-screen">
        <SideBar 
            userRole={userRole} 
            userName={userName} 
        />
        <div className="flex-1 overflow-auto p-4">
            {children}
        </div>
    </div>
    )
}