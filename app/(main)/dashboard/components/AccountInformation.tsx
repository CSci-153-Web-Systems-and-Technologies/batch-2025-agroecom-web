"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AccountInfoSkeleton from './AccountInformationSkeleton'

interface AccountInfoProps {
  initialData?: {
    role: string;
    accountAge: string;
    subscription: string;
  };
}

export default function AccountInformation({ initialData }: AccountInfoProps) {
  const [loading, setLoading] = useState(true)
  // const [role, setRole] = useState("")
  // const [accountAge, setAccountAge] = useState("")
  // const [subscription, setSubscription] = useState("")

  //   async function fetchUserData() {
  //   const supabase = createClient()

  //   // 1. Get auth user
  //   const { data: { user } } = await supabase.auth.getUser()

  //   if (!user) {
  //     setLoading(false)
  //     return
  //   }

  //   // 2. Role (from metadata)
  //   const userRole = user?.app_metadata?.role || user?.user_metadata?.role
  //   setRole(userRole || "Unknown")

  //   // 3. Compute account age
  //   const createdAt = user.created_at || ""
  //   setAccountAge(getAccountAge(createdAt))

  //   // 4. Example: Subscription (mock for now)
  //   setSubscription("Free Tier")

  //   setLoading(false)
  // }

  // function getAccountAge(createdAt: string) {
  //   if (!createdAt) return "Unknown"

  //   const createdDate = new Date(createdAt)
  //   const now = new Date()

  //   const diff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  //   const months = Math.floor(diff / 30)

  //   if (months < 1) return "Less than 1 month"
  //   if (months === 1) return "1 month"
  //   return `${months} months`
  // }

  // Simulate loading for dev purposes
  const role = initialData?.role || 'lender'
  const accountAge = initialData?.accountAge || '5 months'
  const subscription = initialData?.subscription || '1 year'
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <AccountInfoSkeleton />
  }

  return (
    <Card>
      <CardHeader className="text-xl font-(--font-geist-sans)">
        Account Information
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="space-y-2">
            <label className="block text-sm font-medium">Role</label>
            <Input value={role} readOnly className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Account Age</label>
            <Input value={accountAge} readOnly className="bg-gray-50" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Subscription Information</label>
          <Input value={subscription} readOnly className="bg-gray-50" />
        </div>

      </CardContent>
    </Card>
    )
}