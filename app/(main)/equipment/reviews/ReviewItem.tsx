'use client'

import { StarRating } from '@/components/ui/star-rating'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReviewItemProps } from "@/types"

export default function ReviewItem({ review }: { review: ReviewItemProps }) {
  const userName = review.users 
    ? `${review.users.first_name} ${review.users.last_name}` 
    : 'Anonymous';
  
  const location = review.users?.address || 'Unknown location';
  
  const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2">
      <div className="flex gap-4">
        <div className="shrink-0">
            <Avatar className="h-10 w-10 border border-gray-200">
                {review.users?.avatar_url && (
                  <AvatarImage 
                    src={review.users.avatar_url} 
                    alt={userName}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold text-xs">
                    {initials}
                </AvatarFallback>
            </Avatar>
        </div>

        <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{userName}</h4>
                    <p className="text-xs text-gray-500 font-medium">{location}</p>
                </div>
                <span className="text-xs text-gray-400 tabular-nums whitespace-nowrap ml-2">
                    {formattedDate}
                </span>
            </div>

            <div className="flex items-center">
                <StarRating rating={review.rating_count} size={4} />
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
                {review.comment}
            </p>
        </div>
      </div>
    </div>
  );
}