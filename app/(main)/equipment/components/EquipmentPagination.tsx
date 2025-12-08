// components/EquipmentPagination.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface EquipmentPaginationProps {
  totalPages: number;
}

export function EquipmentPagination({ totalPages }: EquipmentPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious 
            href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'} 
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* First Page */}
        {currentPage > 2 && (
            <PaginationItem className="hidden sm:inline-block">
                <PaginationLink href={createPageURL(1)}>1</PaginationLink>
            </PaginationItem>
        )}

        {/* Ellipsis if far from start */}
        {currentPage > 3 && (
            <PaginationItem className="hidden sm:inline-block">
                <PaginationEllipsis />
            </PaginationItem>
        )}

        {/* Current Page */}
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Ellipsis if far from end */}
        {currentPage < totalPages - 2 && (
            <PaginationItem className="hidden sm:inline-block">
                <PaginationEllipsis />
            </PaginationItem>
        )}

        {/* Last Page */}
        {currentPage < totalPages - 1 && (
             <PaginationItem className="hidden sm:inline-block">
                <PaginationLink href={createPageURL(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext 
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}