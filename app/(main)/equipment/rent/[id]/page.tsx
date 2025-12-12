import Image from 'next/image'
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
import { getEquipmentById, getEquipmentImageById } from '@/lib/equipment-actions'
import { EquipmentData } from "../../components/EquipmentDetails" 
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EquipmentDetailPage({ params }: PageProps) {
  const { id } = await params
  
  const equipmentId = id 
  const isFarmer = true 

  const [imageData, equipmentDetails] = await Promise.all([
    getEquipmentImageById(equipmentId),
    getEquipmentById(equipmentId) 
  ])

  const imageUrl = imageData?.image_url || '/Hero_bg.jpg'
  const equipmentName = imageData?.name || 'Equipment'

  return (
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
               <BreadcrumbPage>{equipmentName}</BreadcrumbPage>
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
               priority 
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
           <div className="sticky top-8">78
             <EquipmentDetails data={equipmentDetails as unknown as EquipmentData} /> 
             <ReviewsSection equipmentId={equipmentId} />
           </div>
         </div> 
       </div>
     </div>
  );
}