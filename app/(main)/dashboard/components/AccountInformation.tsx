"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AccountInfoSkeleton from './AccountInformationSkeleton'
import { getAccountDetails } from "@/lib/profile-actions"
import { toast } from "sonner"

interface AccountData {
  role: string
  accountAge: string
  subscription: string
}

interface AccountInfoProps {
  initialData?: AccountData
}

export default function AccountInformation({ initialData }: AccountInfoProps) {
  const [loading, setLoading] = useState(!initialData)
  const [data, setData] = useState<AccountData>(initialData || {
    role: '',
    accountAge: '',
    subscription: ''
  })

  useEffect(() => {
    if (initialData) return

    const loadData = async () => {
      try {
        const result = await getAccountDetails()
        
        if (result.success && result.data) {
          setData(result.data as AccountData)
        } else {
          toast.error("Failed to load account details")
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [initialData])

  if (loading) {
    return <AccountInfoSkeleton />
  }

  return (
    <Card>
      <CardHeader className="text-xl font-semibold">
        Account Information
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Role</label>
            <Input 
              value={data.role} 
              readOnly 
              className="bg-muted capitalize" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Account Age</label>
            <Input 
              value={data.accountAge} 
              readOnly 
              className="bg-muted" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Subscription Information</label>
          <Input 
            value={data.subscription} 
            readOnly 
            className="bg-muted" 
          />
        </div>
      </CardContent>
    </Card>
  )
}