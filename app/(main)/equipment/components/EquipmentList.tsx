'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { EquipmentCard } from './EquipmentCard';
import { getEquipmentList, getEquipmentById, EquipmentFilters } from '@/lib/equipment-actions';
import PaginationControl from './PaginationControl';
import EquipmentToolbar from './EquipmentToolbar';
import { Skeleton } from '@/components/ui/skeleton';

interface Equipment {
  id: string;
  name: string;
  rate: number;
  model: string;
  image_url?: string;
  location?: string;
  rental_count?: number;
  average_rating?: number;
  total_reviews?: number;
}

export default function EquipmentListClient() {
  const searchParams = useSearchParams();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const filters = useMemo((): EquipmentFilters => ({
    location: searchParams.get('location') || undefined,
    type: searchParams.get('type') || undefined,
    view: searchParams.get('view') || 'marketplace',
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 4,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
  }), [searchParams]);

  const limit = filters.limit || 4;
  const totalPages = Math.ceil(count / limit);
  const currentPage = filters.page || 1;

  useEffect(() => {
    startTransition(async () => {
      const result = await getEquipmentList(filters);

      if (result.data && result.data.length > 0) {
        const enrichedData = await Promise.all(
          result.data.map(async (item) => {
            const stats = await getEquipmentById(item.id);

            return {
              ...item,
              ...(stats || {
                location: item.location,
                rental_count: 0,
                average_rating: 0,
                total_reviews: 0
              })
            };
          })
        );

        setEquipment(enrichedData as unknown as Equipment[]);
      } else {
        setEquipment([]);
      }

      setCount(result.count || 0);
      setIsInitialLoading(false);
    });
  }, [filters]);

  const isLoading = isPending || isInitialLoading;

  return (
    <section className="space-y-6">
      <EquipmentToolbar />
      {isLoading ? (
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
              <EquipmentCard
                key={item.id}
                id={item.id}
                name={item.name}
                rate={item.rate}
                model={item.model}
                image_url={item.image_url}
                location={item.location}
                average_rating={item.average_rating}
                total_reviews={item.total_reviews}
                rental_count={item.rental_count}
              />
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