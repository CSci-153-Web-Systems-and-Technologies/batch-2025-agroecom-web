import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, CalendarDays, MessageSquareOff } from "lucide-react"

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  address: string | null;
}

interface SingleReview {
  id: string; 
  rating_count: number | null; 
  comment: string; 
  created_at: string;  
  profiles: ProfileData | null; 
}

export default function RecentReviews({ reviews }: { reviews: SingleReview[] }) {
  const hasReviews = reviews && reviews.length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasReviews ? (
           <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
             <div className="bg-gray-100 p-4 rounded-full">
               <MessageSquareOff className="h-8 w-8 text-gray-400" />
             </div>
             <div>
               <p className="text-gray-900 font-medium">No reviews yet</p>
               <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                 Feedback from different renters will appear here once they complete a booking.
               </p>
             </div>
           </div>
        ) : (
           <div className="space-y-6">
             {reviews.map((review) => {
               const profile = review.profiles;
               const fullName = profile 
                 ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
                 : 'Unknown User';
               const displayName = fullName || 'Anonymous';
               const initials = displayName.slice(0, 2).toUpperCase();
               
               const date = new Date(review.created_at).toLocaleDateString('en-US', {
                 month: 'short',
                 day: 'numeric',
                 year: 'numeric'
               });

               return (
                 <div key={review.id} className="space-y-3 border-b pb-6 last:border-0 last:pb-0">
                   <div className="flex items-start justify-between">
                     <div className="flex items-center space-x-3">
                       <Avatar>
                         <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                         <AvatarFallback>{initials}</AvatarFallback>
                       </Avatar>
                       
                       <div>
                         <h4 className="font-semibold text-sm">{displayName}</h4>
                         <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-gray-500 mt-0.5">
                           {profile?.address && (
                             <span className="flex items-center gap-1">
                               <MapPin className="h-3 w-3" />
                               {profile.address}
                             </span>
                           )}
                           {profile?.address && <span className="hidden sm:inline">•</span>}
                           <span className="flex items-center gap-1">
                             <CalendarDays className="h-3 w-3" />
                             {date}
                           </span>
                         </div>
                       </div>
                     </div>
                     <div className="flex">
                       {[...Array(5)].map((_, i) => (
                         <Star
                           key={i}
                           className={`h-4 w-4 ${
                             i < Math.round(review.rating_count || 0) 
                               ? 'fill-yellow-400 text-yellow-400' 
                               : 'text-gray-200'
                           }`}
                         />
                       ))}
                     </div>
                   </div>
                   <p className="text-sm text-gray-700 leading-relaxed">
                     {review.comment}
                   </p>
                 </div>
               );
             })}
           </div>
        )}
      </CardContent>
    </Card>
  )
}