"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import DashboardTable, { type DashboardTableRef, type UserRoleFilter } from "@/components/DashboardTable"
import RentalsFilter from "@/app/(main)/dashboard/components/RentalsFilter"

import { Download } from "lucide-react"

export default function AdminPage() {
  const tableRef = useRef<DashboardTableRef>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("all")

  const handleExport = () => {
    tableRef.current?.exportData('csv')
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins p-4 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">Manage and review all user accounts</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              className="gap-2 bg-(--btn-primary) hover:bg-(--btn-primary)/90"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
        <Separator />
      </div>

      <RentalsFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mode="role"
        filter={roleFilter}
        onFilterChange={setRoleFilter}
        searchPlaceholder="Search users by name, email, or location..."
      />

      <DashboardTable 
        ref={tableRef} 
        userRole="admin" 
        roleFilter={roleFilter}
        searchQuery={searchQuery}
      />
    </div>
  )
}