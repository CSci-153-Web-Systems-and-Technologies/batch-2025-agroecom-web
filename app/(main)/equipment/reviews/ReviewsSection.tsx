'use client'
import React, { useState,  } from 'react';
import ReviewItem from './ReviewItem'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';

type Review = {
  user: string;
  date: string;
  rating: number;
  location: string;
  comment: string;
  role: string;
};

interface ReviewItemProps {
  user: string;
  date: string;
  rating: number;
  location: string;
  comment: string;
  role: string;
};

export default function ReviewsSection({ reviews }: { reviews: ReviewItemProps[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 4;
    
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    return (
        <div className="p-4 border-t">
            <div className="h-[400px] pt-2 overflow-auto">
                {currentReviews.length > 0 ? (
                    currentReviews.map((review: Review, index: number) => (
                        <ReviewItem key={index} review={review} />
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No reviews to display</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pt-4">
                    <Pagination>
                        <PaginationPrevious
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            aria-disabled={currentPage === 1}
                            className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />

                        <PaginationContent>
                            {pageNumbers.map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={page === currentPage}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        </PaginationContent>

                        <PaginationNext
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            aria-disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                    </Pagination>
                </div>
            )}
        </div>
    );
}