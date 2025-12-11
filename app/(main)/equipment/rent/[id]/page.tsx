'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import EquipmentDetails from '../../components/EquipmentDetails'
import ReviewsSection from '../../reviews/ReviewsSection'
import WriteReviewForm from '../../reviews/WriteReviewForm'
import RentRequestModal from '../../components/RentRequestModal'
import { getEquipmentImageById } from '@/lib/equipment-actions'

export default function EquipmentDetailPage() {
  const params = useParams()
  const equipmentId = params.id as string
  const [imageUrl, setImageUrl] = useState('/Hero_bg.jpg')
  const [equipmentName, setEquipmentName] = useState('Equipment')
  const isFarmer = true

  useEffect(() => {
    async function fetchEquipmentImage() {
      const data = await getEquipmentImageById(equipmentId)
      if (data?.image_url) {
        setImageUrl(data.image_url)
        setEquipmentName(data.name || 'Equipment')
      }
    }
    if (equipmentId) {
      fetchEquipmentImage()
    }
  }, [equipmentId])

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:p-8 py-6">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/equipment">Equipment</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Rent</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={imageUrl}
                alt={equipmentName}
                fill
                className="object-cover w-full h-full"
              />
            </div>
            {isFarmer && (
              <>
                <div className="w-full inline-flex justify-center">
                  <RentRequestModal />
                </div>
                <WriteReviewForm equipmentId={equipmentId} />
              </>
            )}
          </div>
          <div className="lg:col-span-7 relative">
            <div className="sticky top-8">
              <EquipmentDetails equipmentId={equipmentId} />
              <ReviewsSection equipmentId={equipmentId} />
            </div>
          </div> 
        </div>
      </div>
    </>
  );
}