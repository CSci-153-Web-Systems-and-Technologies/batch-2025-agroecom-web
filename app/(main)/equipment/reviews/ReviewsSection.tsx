'use client'
import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem'
import { getEquipmentReviews } from '@/lib/equipment-actions'
import { Loader2, MessageSquare, Star } from 'lucide-react'

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
  } | null;
}

interface ReviewsSectionProps {
  equipmentId: string;
}

export default function ReviewsSection({ equipmentId }: ReviewsSectionProps) {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      async function fetchReviews() {
        setIsLoading(true);
        const data = await getEquipmentReviews(equipmentId);
        setReviews((data as unknown as ReviewData[]) || []);
        setIsLoading(false);
      }
      
      if (equipmentId) {
        fetchReviews();
      }
    }, [equipmentId]);

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
                <div className="p-2 rounded-lg">
                    <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                    Reviews 
                    <span className="ml-2 text-base font-normal text-gray-500">
                        ({reviews.length})
                    </span>
                </h3>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
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
        </div>
    );
}