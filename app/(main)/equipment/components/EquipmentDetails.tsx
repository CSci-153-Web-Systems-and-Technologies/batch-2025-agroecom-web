'use client'

import { useState } from 'react'
import { StarRating } from '@/components/ui/star-rating'
import { SquarePen, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUserData } from '@/lib/user-data'

// DEV MODE: Set to true to use mock data
const DEV_MODE = true;

interface EquipmentProps {
    id: string,
    name: string,
    maker: string,
    model: string,
    owner: string,
    delivery: string,
    description: string,
    imageUrl: string,
    useCase: string,
    availability: string,
    overallRating: number,
    rentedCount: number,
}; 

// Mock equipment data for development
const mockEquipmentDetails: EquipmentProps = {
  id: '101',
  name: 'Rice Harvester Pro',
  maker: 'LOVOL',
  model: 'HJ-38402',
  owner: 'AgriTech Solutions',
  delivery: 'Pickup / Deliver within Ormoc City',
  description: 'High-performance rice harvester suitable for all rice field sizes. Features advanced cutting technology and efficient grain separation.',
  imageUrl: '/Hero_bg.jpg',
  useCase: 'Small to large-scale rice farms, suitable for wet and dry field conditions',
  availability: 'Daily / Weekly / Seasonal rental',
  overallRating: 4.7,
  rentedCount: 1250,
};

export default function EquipmentDetails({ equipment: propEquipment }: { equipment?: EquipmentProps }) {
  const equipment = DEV_MODE ? mockEquipmentDetails : propEquipment!;
  const { user } = useUserData()

  const isLender = user?.user_metadata?.role === 'lender' || user?.app_metadata?.role === 'lender'
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: equipment.name,
    model: equipment.model,
    maker: equipment.maker,
    owner: equipment.owner,
    delivery: equipment.delivery,
    availability: equipment.availability,
    useCase: equipment.useCase,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log('Saving equipment data:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: equipment.name,
      model: equipment.model,
      maker: equipment.maker,
      owner: equipment.owner,
      delivery: equipment.delivery,
      availability: equipment.availability,
      useCase: equipment.useCase,
    })
    setIsEditing(false)
  }

  return (
    <div className="p-2">
      <div className="space-y-2 text-gray-700">
        <div className="flex items-center justify-between gap-2">
          {isEditing ? (
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-3xl font-bold text-gray-900 border-2"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
          )}
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSave}
                  className="p-4 hover:bg-green-100"
                >
                  <Check className="h-8 w-8 text-green-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleCancel}
                  className="p-4 hover:bg-red-100"
                >
                  <X className="h-8 w-8 text-red-600" />
                </Button>
              </>
            ) : (
              isLender && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="p-4 hover:bg-gray-100"
                >
                  <SquarePen className="h-8 w-8"/>
                </Button>
              )
            )}
          </div>
        </div>
        
        <div className="text-sm flex items-center gap-2 px-3 py-1">
          <span className="font-semibold">Owner: <span>{formData.owner}</span></span>
        </div>

        <div className="text-sm space-y-2 pt-2 px-3 py-1">
          <p className="font-semibold">Specifications: </p>
        </div>
          
        <div className="space-y-2">
          <div className="text-sm flex items-center gap-2 px-3 py-1">
            <span>Model:</span>
            {isEditing ? (
              <Input
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="flex-1"
              />
            ) : (
              <span>{formData.model}</span>
            )}
          </div>

          <div className="text-sm flex items-center gap-2 px-3 py-1">
            <span>Maker:</span>
            {isEditing ? (
              <Input
                name="maker"
                value={formData.maker}
                onChange={handleChange}
                className="flex-1"
              />
            ) : (
              <span>{formData.maker}</span>
            )}
          </div>

          <div className="text-sm flex items-center gap-2 px-3 py-1">
            <span>Delivery:</span>
            {isEditing ? (
              <Input
                name="delivery"
                value={formData.delivery}
                onChange={handleChange}
                className="flex-1"
              />
            ) : (
              <span>{formData.delivery}</span>
            )}
          </div>
        </div>

        <div className="text-sm space-y-2 pt-2 px-3 py-1">
          <p className="font-semibold">Description:</p>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Availability:</span>
            {isEditing ? (
              <Input
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="flex-1"
              />
            ) : (
              <span>{formData.availability}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Ideal For:</span>
            {isEditing ? (
              <Textarea
                name="useCase"
                value={formData.useCase}
                onChange={handleChange}
                className="flex-1 min-h-[60px]"
              />
            ) : (
              <span>{formData.useCase}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <StarRating rating={equipment.overallRating} size={5} />
        <span className="text-sm font-medium text-gray-600 border-r pr-2">
          {equipment.overallRating}k Ratings
        </span>
        <span className="text-sm text-gray-600">
          {equipment.rentedCount} rented
        </span>
      </div>
    </div>
  );
};