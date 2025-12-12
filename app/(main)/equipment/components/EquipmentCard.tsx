'use client'

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from "next/navigation";
import { StarRating } from '@/components/ui/star-rating';
import { MapPin } from 'lucide-react';

interface EquipmentCardProps {
  id: string;
  name: string;
  rate: string | number;
  model: string;
  image_url?: string;
  location?: string;
  rental_count?: number;
  average_rating?: number;
  total_reviews?: number;
}

export function EquipmentCard({ 
  id, 
  rate, 
  name, 
  model, 
  image_url, 
  location, 
  rental_count = 0, 
  average_rating = 0, 
  total_reviews = 0 
}: EquipmentCardProps) {
  const pathname = usePathname();

  return (
    <>
      <Link href={`${pathname}/rent/${id}`} className="block" prefetch={false}>
        <Card className="overflow-hidden border hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
          <div className="relative h-48 w-full bg-gray-100">
            <Image
              src={image_url || "/Hero_bg.jpg"} 
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4 flex flex-col gap-2 flex-1">
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={name}>{name}</h3>
              <p className="text-sm text-gray-500 font-medium">{model}</p>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className='flex items-center space-x-1'>
                <StarRating rating={average_rating} size={4} />
                <span className="text-xs text-gray-500 font-medium">
                  {average_rating} ({total_reviews})
                </span>
              </div>
            </div>

            <div className="flex items-center text-xs text-gray-500 mt-1 min-h-5">
              {location ? (
                <>
                  <MapPin className="w-3 h-3 mr-1 text-green-600 shrink-0" />
                  <span className="truncate">{location}</span>
                </>
              ) : (
                <span className="text-gray-400 italic">Location N/A</span>
              )}
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Rate</span>
                <span className="text-lg font-bold text-green-700">₱{Number(rate).toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Rented</span>
                <span className="text-sm font-medium text-gray-700">
                  {rental_count} times
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}