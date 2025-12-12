"use client"

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { postReview } from "@/lib/equipment-actions";
import { toast } from "sonner";
import { WriteReviewFormProps } from '@/types'

export default function WriteReviewForm({ equipmentId, onSuccess }: WriteReviewFormProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    
    if (selectedRating === 0) {
      setError("Please select a rating");
      return;
    }
    
    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    setIsSubmitting(true);
  
    try {
      const result = await postReview({
        equipment_id: equipmentId,
        rating_count: selectedRating,
        comment: reviewText.trim(),
      });

      if (result.success) {
        setSelectedRating(0);
        setReviewText("");
        toast.success("Review submitted!", {
          description: "Thank you for sharing your feedback.",
        });
        onSuccess?.();
      } else {
        toast.error("Failed to submit review", {
          description: result.error || "Please try again later.",
        });
        setError(result.error || "Failed to submit review");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedRating(0);
    setReviewText("");
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium text-gray-800 mb-3">Rate the product!</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-2 mb-4" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setSelectedRating(i)}
            aria-pressed={i <= selectedRating}
            aria-label={`${i} star`}
            className="p-1 rounded disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                i <= (hoverRating || selectedRating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
      </div>

      <Label htmlFor="review-text" className="text-sm font-medium text-gray-700 mb-1 block">
        Tell us more.
      </Label>
      <Textarea
        id="review-text"
        rows={5}
        placeholder="Share your experience..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        disabled={isSubmitting}
        className="mt-2 border-gray-300 focus:border-(--btn-primary) focus:ring-(--btn-primary) resize-none overflow-y-auto min-h-[120px] max-h-[120px]"
      />

      <div className="flex justify-end space-x-4 mt-4">
        <Button 
          variant="outline" 
          type="button" 
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
