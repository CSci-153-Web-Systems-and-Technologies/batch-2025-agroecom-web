"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { type RentalStatus, type UserRoleFilter } from "@/components/DashboardTable"

interface BaseFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  searchPlaceholder?: string
}

interface StatusFilterProps extends BaseFilterProps {
  mode: 'status'
  filter: RentalStatus
  onFilterChange: (status: RentalStatus) => void
}

interface RoleFilterProps extends BaseFilterProps {
  mode: 'role'
  filter: UserRoleFilter
  onFilterChange: (role: UserRoleFilter) => void
}

type RentalsFilterProps = StatusFilterProps | RoleFilterProps

export default function RentalsFilter(props: RentalsFilterProps) {
  const {
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search by name, email, or location...",
    mode,
    filter,
    onFilterChange
  } = props

  const [isFilterActive, setIsFilterActive] = useState(true)

  const toggleFilter = () => {
    setIsFilterActive(!isFilterActive)
    if (isFilterActive) {
      onFilterChange("all" as never)
    }
  }

  const handleFilter = (value: string) => {
    onFilterChange(value as never)
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-2">
              <Button 
                variant={isFilterActive ? "default" : "outline"} 
                className={`gap-2 ${isFilterActive ? "bg-(--btn-primary) hover:bg-(--btn-primary)/90" : ""}`}
                onClick={toggleFilter}
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            
            {mode === 'status' ? (
              <div className="flex gap-2">
                <Button 
                  variant={filter === "all" ? "default" : "outline"} 
                  className={`px-3 ${filter === "all" ? "bg-(--btn-primary) hover:bg-(--btn-primary)/90" : ""}`}
                  onClick={() => handleFilter("all")}
                  disabled={!isFilterActive}
                >
                  All
                </Button>
                <Button 
                  variant={filter === "pending" ? "default" : "outline"} 
                  className={`px-3 ${filter === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
                  onClick={() => handleFilter("pending")}
                  disabled={!isFilterActive}
                >
                  Pending
                </Button>
                <Button 
                  variant={filter === "rejected" ? "default" : "outline"} 
                  className={`px-3 ${filter === "rejected" ? "bg-red-500 hover:bg-red-600" : ""}`}
                  onClick={() => handleFilter("rejected")}
                  disabled={!isFilterActive}
                >
                  Rejected
                </Button>
                <Button 
                  variant={filter === "approved" ? "default" : "outline"} 
                  className={`px-3 ${filter === "approved" ? "bg-green-500 hover:bg-green-600" : ""}`}
                  onClick={() => handleFilter("approved")}
                  disabled={!isFilterActive}
                >
                  Approved
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant={filter === "all" ? "default" : "outline"} 
                  className={`px-3 ${filter === "all" ? "bg-(--btn-primary) hover:bg-(--btn-primary)/90" : ""}`}
                  onClick={() => handleFilter("all")}
                  disabled={!isFilterActive}
                >
                  All
                </Button>
                <Button 
                  variant={filter === "lender" ? "default" : "outline"} 
                  className={`px-3 ${filter === "lender" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                  onClick={() => handleFilter("lender")}
                  disabled={!isFilterActive}
                >
                  Lender
                </Button>
                <Button 
                  variant={filter === "farmer" ? "default" : "outline"} 
                  className={`px-3 ${filter === "farmer" ? "bg-green-500 hover:bg-green-600" : ""}`}
                  onClick={() => handleFilter("renter")}
                  disabled={!isFilterActive}
                >
                  Renter
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
