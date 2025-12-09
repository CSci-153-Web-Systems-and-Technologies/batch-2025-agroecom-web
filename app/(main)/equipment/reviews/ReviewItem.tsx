import { StarRating } from '@/components/ui/star-rating'

interface ReviewItemProps {
  user: string;
  date: string;
  rating: number;
  location: string;
  comment: string;
  role: string;
};


export default function ReviewItem({ review }: { review: ReviewItemProps }) {
  return (
    <div className="pb-2 mb-2 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-800">{review.user}</h4>
        </div>
      </div>
      
      <StarRating rating={review.rating} size={4} />
      
      <p className="text-xs text-gray-500 mt-0.5">
        {review.location} | {review.date}
      </p>
      
      <p className="text-sm text-gray-700 mt-1">
        {review.comment}
      </p>
    </div>
  );
};
