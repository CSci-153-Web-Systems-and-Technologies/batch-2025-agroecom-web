'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { EquipmentCard } from './EquipmentCard';
import { getEquipmentList, EquipmentFilters } from '@/lib/equipment-actions';
import PaginationControl from './PaginationControl';
import EquipmentToolbar from './EquipmentToolbar';
import { Skeleton } from '@/components/ui/skeleton';

interface Equipment {
  id: string;
  name: string;
  rate: string;
  model: string;
  image_url?: string;
}

export default function EquipmentListClient() {
  const searchParams = useSearchParams();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Build filters from URL search params
  const filters: EquipmentFilters = {
    location: searchParams.get('location') || undefined,
    type: searchParams.get('type') || undefined,
    view: searchParams.get('view') || 'marketplace',
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 4,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
  };

  const limit = filters.limit || 4;
  const totalPages = Math.ceil(count / limit);
  const currentPage = filters.page || 1;

  // Fetch equipment whenever URL params change
  useEffect(() => {
    startTransition(async () => {
      const result = await getEquipmentList(filters);
      setEquipment(result.data || []);
      setCount(result.count || 0);
    });
  }, [searchParams]); // React to URL changes

  return (
    <section className="space-y-6">
      <EquipmentToolbar />

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : equipment.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          No equipment found matching your criteria.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {equipment.map((item) => (
              <EquipmentCard key={item.id} {...item} />
            ))}
          </div>
          <PaginationControl 
            currentPage={currentPage} 
            totalPages={totalPages} 
          />
        </>
      )}
    </section>
  );
}
