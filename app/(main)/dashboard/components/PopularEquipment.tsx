import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, PackageOpen } from "lucide-react"
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
  const hasData = equipment && equipment.length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Popular Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="bg-gray-100 p-4 rounded-full">
                    <PackageOpen className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                    <p className="text-gray-900 font-medium">No rentals yet</p>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                        Once items are rented, the most popular ones will appear here.
                    </p>
                </div>
            </div>
        ) : (
            <div className="space-y-4">
            {equipment.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-md bg-gray-200 relative overflow-hidden flex-shrink-0">
                    <Image
                        src={'/Hero_bg.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                    </div>
                    <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.brand}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">
                        {item.average_rating ? item.average_rating.toFixed(1) : '0.0'} ({item.total_reviews})
                        </span>
                    </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-semibold text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {item.rental_count} rented
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </CardContent>
    </Card>
  )
}