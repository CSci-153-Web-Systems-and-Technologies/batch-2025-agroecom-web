'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControl({ currentPage, totalPages }: PaginationControlProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const navigateToPage = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', pageNumber.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    // Always show first page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink 
            onClick={() => navigateToPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis after first page if needed
    if (showEllipsisStart) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => navigateToPage(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis before last page if needed
    if (showEllipsisEnd) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => navigateToPage(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage <= 1}
            className={`cursor-pointer ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
          />
        </PaginationItem>
        
        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext 
            onClick={() => navigateToPage(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage >= totalPages}
            className={`cursor-pointer ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
