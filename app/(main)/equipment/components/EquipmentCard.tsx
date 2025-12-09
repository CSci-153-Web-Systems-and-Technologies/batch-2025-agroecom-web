'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from "next/navigation";

interface EquipmentCardProps {
  id: string;
  name: string;
  rate: string;
  model: string;
  image_url?: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center space-x-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

export function EquipmentCard({ id, rate, name, model, image_url }: EquipmentCardProps) {
  const pathname = usePathname();
  return (
    <>
      <Link href={`${pathname}/rent/${id}`} className="block" prefetch={false}>
        <Card className="overflow-hidden border hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <div className="relative h-40 w-full">
            <Image
              src={image_url || "/Hero_bg.jpg"} 
              alt={name}
              fill
              className="object-cover rounded-lg px-2"
            />
          </div>
          <CardContent className="p-2 not-only:inline-flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">{model}</p>

            <div className="flex">
              <div className='flex w-full items-center space-x-1 justify-between'>
                <StarRating rating={4.5} />
                <span className="text-sm font-medium text-gray-700">4.5 Ratings</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-semibold block">Rate</span>
                <span className="block">{rate}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold block">Rented</span>
                <span className="block">1,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}