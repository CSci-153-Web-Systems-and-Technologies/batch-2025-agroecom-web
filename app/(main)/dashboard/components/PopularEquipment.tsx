import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

interface Equipment {
  id: string
  name: string
  brand: string
  rental_count: string
  average_rating: number
  total_reviews: number
}
interface PopularEquipmentProps {
  equipment: Equipment[]
}

export default function PopularEquipment({ equipment }: PopularEquipmentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {equipment.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-md bg-gray-200 relative overflow-hidden">
                  <Image
                    src={'/Hero_bg.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.brand}</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {item.average_rating} ({item.total_reviews})
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{item.rental_count} rented</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}