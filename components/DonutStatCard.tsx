import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface DonutStatCardProps {
  title: string
  value: number | string
  label: string
  icon: LucideIcon
  color?: string
}

export default function DonutStatCard({ 
  title, 
  value, 
  label, 
  icon: Icon, 
  color = "var(--nav-bg)" 
}: DonutStatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="relative">
            <div 
              className="h-50 w-50 rounded-full border-8 transition-colors duration-300" 
              style={{ borderColor: color }}
            >
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-2 top-1/2 -translate-y-1/2">
              <div className="rounded-full bg-white p-2 shadow-lg">
                <Icon className="h-5 w-5" style={{ color: color }} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}