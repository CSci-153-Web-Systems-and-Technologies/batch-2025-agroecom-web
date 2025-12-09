'use client'
import Image from 'next/image'

import EquipmentDetails from '../../components/EquipmentDetails'
import ReviewsSection from '../../reviews/ReviewsSection'
import WriteReviewForm from '../../reviews/WriteReviewForm'
import RentRequestModal from '../../components/RentRequestModal'
import { useUserData } from '@/lib/user-data'

const mockEquipment = {
  id: '101',
  name: 'Rice Harvester',
  maker: 'LOVOL',
  model: 'HJ-38402',
  owner: 'Benjie Tech',
  delivery: 'Within Ormoc',
  description: 'Availability: Daily / Weekly / Seasonal rental. Ideal For: Small to large-scale rice farms',
  imageUrl: '/Hero_bg.jpg',
  useCase: 'Small to large-scale rice farms',
  availability:  'Daily / Weekly / Seasonal rental',
  overallRating: 4.5,
  rentedCount: 5000,
};

const mockReviews = [
  {
    user: 'John Doe',
    date: '2026 - 5 - 1',
    rating: 5,
    location: 'Philippines',
    comment: 'Nice product, just right for the job, will support the shop again.',
    role: 'Renter',
  },
  {
    user: 'John the Farmer',
    date: '2027 - 5 - 1',
    rating: 4,
    location: 'Philippines',
    comment: 'It was nice to have a transaction with this owner, their equipment is surely high quality. This helped me harvest my crops with little to no help from other people. In the coming years, I want to still avail to this product because of the quality and the owner is easy to transact with.',
    role: 'Farmer',
  },
  {
    user: 'John the Renter',
    date: '2028 - 5 - 1',
    rating: 5,
    location: 'Philippines',
    comment: 'Will avail again in future harvests.',
    role: 'Renter',
  },
    {
    user: 'John Doe',
    date: '2026 - 5 - 1',
    rating: 5,
    location: 'Philippines',
    comment: 'Nice product, just right for the job, will support the shop again.',
    role: 'Renter',
  },
  {
    user: 'John the Farmer',
    date: '2027 - 5 - 1',
    rating: 4,
    location: 'Philippines',
    comment: 'It was nice to have a transaction with this owner, their equipment is surely high quality. This helped me harvest my crops with little to no help from other people.',
    role: 'Farmer',
  },
  {
    user: 'John the Renter',
    date: '2028 - 5 - 1',
    rating: 5,
    location: 'Philippines',
    comment: 'Will avail again in future harvests.',
    role: 'Renter',
  },
];

export default function EquipmentDetailPage() {
  const { user } = useUserData()
  const isFarmer = user?.app_metadata?.role === 'farmer';

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={mockEquipment.imageUrl}
                alt={mockEquipment.name}
                fill
                className="object-cover w-full h-full"
              />
            </div>
            {isFarmer && (
              <>
                <div className="w-full inline-flex justify-center">
                  <RentRequestModal />
                </div>
                <WriteReviewForm />
              </>
            )}
          </div>
          <div className="lg:col-span-7 relative">
            <div className="sticky top-8">
              <EquipmentDetails equipment={mockEquipment} />
              <ReviewsSection reviews={mockReviews} />
            </div>
          </div> 
        </div>
      </div>
    </>
  );
}