'use client'

import { use, useEffect, useState } from "react"
import RentalForm from "@/app/(main)/dashboard/components/RentalForm"
import LenderEquipmentCard from "@/app/(main)/dashboard/components/LenderEquipmentCard"
import { getEquipmentRentalInfo } from '@/lib/equipment-actions'

interface RentalRequestViewProps {
  params: Promise<{ id: string }>
}

type RentalRequest = Awaited<ReturnType<typeof getEquipmentRentalInfo>>[number];

export interface RentalDetailsProps {
  rental?: RentalRequest;
}

type EquipmentData = Awaited<ReturnType<typeof getEquipmentRentalInfo>>;

export default function RentalRequestView({ params }: RentalRequestViewProps) {
  const { id } = use(params);

  const [equipment, setEquipment] = useState<EquipmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getEquipmentRentalInfo(id);
        
        if (!data) {
          setError(true);
        } else {
          console.log("Retrieved Rental: ", data)
          setEquipment(data);
        }
      } catch (err) {
        console.error("Failed to fetch equipment info:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (!id) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-gray-500">Invalid Request ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-red-500">Rental request not found or could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-7xl mx-auto font-(--font-geist-sans)">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LenderEquipmentCard rental={equipment[0]} />
        <RentalForm rental={equipment[0]} />
      </div>
    </div>
  );
}