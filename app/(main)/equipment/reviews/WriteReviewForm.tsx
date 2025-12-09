"use client"

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function WriteReviewForm() {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("submit review", { rating: selectedRating, text: reviewText });
    setSelectedRating(0);
    setReviewText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium text-gray-800 mb-3">Rate the product!</h3>

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
            className="p-1 rounded"
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
        className="mt-2 border-gray-300 focus:border-(--btn-primary) focus:ring-(--btn-primary) resize-none overflow-y-auto min-h-[120px] max-h-[120px]"
      />

      <div className="flex justify-end space-x-4 mt-4">
        <Button variant="outline" type="button" onClick={() => { setSelectedRating(0); setReviewText(""); }}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
