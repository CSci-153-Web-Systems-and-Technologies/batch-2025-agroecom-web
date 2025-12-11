'use client'
import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem'
import { getEquipmentReviews } from '@/lib/equipment-actions'
import { Loader2, MessageSquare, Star } from 'lucide-react'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';

export interface ReviewData {
  id: string;
  user_id: string;
  equipment_id: string;
  rating_count: number;
  comment: string;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    address: string;
    avatar_url?: string; 
  } | null;
}

interface ReviewsSectionProps {
  equipmentId: string;
}

export default function ReviewsSection({ equipmentId }: ReviewsSectionProps) {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [totalCount, setTotalCount] = useState(0); 
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 4;
    
    useEffect(() => {
      async function fetchReviews() {
        setIsLoading(true);
        const result = await getEquipmentReviews(equipmentId, currentPage, reviewsPerPage);
        
        setReviews((result.data as unknown as ReviewData[]) || []);
        setTotalCount(result.count || 0);
        setIsLoading(false);
      }
      
      if (equipmentId) {
        fetchReviews();
      }
    }, [equipmentId, currentPage]); 

    const totalPages = Math.ceil(totalCount / reviewsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (isLoading) {
      return (
        <div className="py-12 flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p className="text-sm">Loading reviews...</p>
        </div>
      );
    }

    return (
        <div className="pt-8 pb-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                    Reviews 
                    <span className="ml-2 text-base font-normal text-gray-500">
                        ({totalCount})
                    </span>
                </h3>
            </div>

            <div className="space-y-1 min-h-[200px]">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-100">
                        <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                            <Star className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="font-medium text-gray-900">No reviews yet</p>
                        <p className="text-sm text-gray-500">Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            
                            {pageNumbers.map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink 
                                        isActive={page === currentPage}
                                        onClick={() => handlePageChange(page)}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}