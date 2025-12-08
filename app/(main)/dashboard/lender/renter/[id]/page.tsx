'use client'

import { use } from "react"
import LenderEquipmentCard from "@/app/(main)/dashboard/components/LenderEquipmentCard"
import RentalForm from "@/app/(main)/dashboard/components/RentalForm"
import { useRentals } from "@/contexts/RentalContext"

interface RentalRequestViewProps {
  params: Promise<{ id: string }>
}

export default function RentalRequestView({ params }: RentalRequestViewProps) {
  const { id } = use(params);
  const { getRentalById } = useRentals();
  const rental = getRentalById(id);

  const equipment = {
    name: rental?.equipment || 'Equipment',
    maker: 'LOVOL',
    owner: 'Farm Solutions',
    delivery: 'Within Ormoc only',
    description: 'Availability: Daily / Weekly / Seasonal rental. Ideal For: Small to large-scale farms',
    imageUrl: '/Hero_bg.jpg',
    rating: 4.5,
    rentedCount: 500,
    price: 1200,
  };

  if (!rental) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-gray-500">Rental request not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-7xl mx-auto font-(--font-geist-sans)">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LenderEquipmentCard equipment={equipment} />
        <RentalForm rentalId={id} />
      </div>
    </div>
  );
}