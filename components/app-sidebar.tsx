'use client'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter, usePathname } from 'next/navigation'
import { PieChart, Book, Users } from "lucide-react"

interface SideBarProps {
  userRole: string; 
  userName: string;
  userAvatar?: string;
}

export default function SideBar({ userRole, userName, userAvatar }: SideBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const role = (userRole || 'farmer').toLowerCase(); 

  const isAdmin = role === 'admin';
  const isFarmer = role === 'farmer';

  const profilePath = `/dashboard/${role}/profile`;
  const mainPath = `/dashboard/${role}`;
  
  const mainLabel = isAdmin ? 'Accounts' : 'Rental Requests';
  const mainIcon = isAdmin ? <Users className="w-8 h-8" /> : <Book className="w-8 h-8" />;

  return (
    <div className="flex">
      <aside className="hidden w-64 border-r bg-white lg:block">
        <nav className="space-y-1 p-4">
          <div className="mb-8">
            <div className="space-y-1">
              <Button 
                variant="ghost"
                className={`p-8 w-full justify-start gap-2 border rounded-2xl ${pathname === profilePath ? 'bg-gray-100' : ''}`}
                onClick={() => router.push(profilePath)}
              >
                <Avatar>
                  <AvatarImage src={userAvatar} alt="Profile Picture" />
                  <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="truncate w-full font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground capitalize">{role}</span>
                </div>
              </Button>
              
              {!isFarmer && (
                <Button 
                  variant="ghost" 
                  className={`p-8 w-full justify-start gap-2 border rounded-2xl ${pathname === '/dashboard/overview' ? 'bg-gray-100' : ''}`}
                  onClick={() => router.push('/dashboard/overview')}
                >
                  <PieChart className="w-8 h-8" />
                  Overview
                </Button>
              )}
              
              {!isFarmer && (
                <Button
                  variant="ghost"
                  className={`p-8 w-full justify-start gap-2 border rounded-2xl ${pathname === mainPath ? 'bg-gray-100' : ''}`}
                  onClick={() => router.push(mainPath)}
                >
                  {mainIcon}
                  {mainLabel}
                </Button>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}