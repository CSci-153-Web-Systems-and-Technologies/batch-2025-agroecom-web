'use client'

import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { getEquipmentRentalInfo } from '@/lib/equipment-actions'

type RentalRequest = Awaited<ReturnType<typeof getEquipmentRentalInfo>>[number];

export interface RentalDetailsProps {
  rental?: RentalRequest;
}

export default function LenderEquipmentCard({ rental }: RentalDetailsProps) {
  if (!rental || !rental.equipment) {
    return (
      <div className="lg:col-span-1 p-6 bg-gray-50 border rounded-lg">
        <p className="text-gray-500">Equipment details unavailable.</p>
      </div>
    );
  }

  const { equipment, owner } = rental;
  const reviewCount = equipment.reviews?.length || 0;
  const averageRating = 0; 

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="w-full h-64 relative">
            <Image
              src={equipment.image_url || '/Hero_bg.jpg'}
              alt={equipment.model || 'Equipment'}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{equipment.model || "Unknown Model"}</h2>
              
              <p className="text-lg text-gray-600">
                Owned by: {owner ? `${owner.first_name} ${owner.last_name}` : "Unknown"}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'fill-current' : 'fill-none'}`}
                  />
                ))}
              </div>
              <span className="text-gray-700 font-semibold">
                {averageRating} ({reviewCount} Reviews)
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-700">{equipment.rental_count} Rents</span>
            </div>

            <div className="text-2xl font-bold text-primary">
              ₱{equipment.rate} <span className="text-sm font-normal text-gray-500">/ day</span>
            </div>
            
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <h3 className="text-lg font-bold">Equipment Details</h3>
              
              <p className="text-sm">
                <span className="font-semibold">Model:</span> {equipment.model}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Delivery:</span> {equipment.delivery}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Description:</span> {equipment.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}