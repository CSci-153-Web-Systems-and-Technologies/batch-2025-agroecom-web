import { ReactNode } from "react"
import SideBar from "@/components/app-sidebar" 
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"

interface DashboardLayoutProps {
    children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }
    const userRole = user.user_metadata?.role || 'farmer'
    const userName = user.user_metadata?.first_name || 
                    user.user_metadata?.full_name || 
                    user.email?.split('@')[0] || 
                    'User'
                     
    const userAvatar = user.user_metadata?.avatar_url || ''

    return (
        <div className="flex min-h-screen">
            <SideBar 
                userRole={userRole} 
                userName={userName} 
                userAvatar={userAvatar}
            />
            <div className="flex-1 overflow-auto p-4">
                {children}
            </div>
        </div>
    )
}