import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatItem } from '@/types'

interface StatsGridProps {
  stats: StatItem[]
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.iconColor || "text-gray-500"}`} />
          </CardHeader>
          <CardContent>
            <div 
              className={`text-2xl font-bold ${stat.valueColor || ""}`}
            >
              {stat.value}
            </div>
            {stat.description && (
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}