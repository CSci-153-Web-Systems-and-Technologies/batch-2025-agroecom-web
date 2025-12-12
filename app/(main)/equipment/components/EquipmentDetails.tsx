'use client'

import { useState } from 'react'
import { StarRating } from '@/components/ui/star-rating'
import { SquarePen, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useUserData } from '@/lib/user-data'
import { updateEquipment } from '@/lib/equipment-actions'
import { toast } from 'sonner'
export interface EquipmentData {
  id: string 
  name: string
  model: string
  description: string
  delivery: string
  rate: number
  location: string
  user_id: string 
  average_rating: number
  total_reviews: number
  rental_count: number
  users: {
    first_name: string
    last_name: string
  } | null
}

interface EquipmentDetailsProps {
  data: EquipmentData 
}

export default function EquipmentDetails({ data }: EquipmentDetailsProps) {
  const { user } = useUserData()

  const [equipment, setEquipment] = useState<EquipmentData | null>(data as EquipmentData)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: data?.name || '',
    model: data?.model || '',
    description: data?.description || '',
    delivery: data?.delivery || '',
    location: data?.location || '', 
    rate: data?.rate || 0,
  })

  if (!equipment) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        Equipment not found.
      </div>
    )
  }

  const isOwner = user?.id === equipment?.user_id

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'rate' ? Number(value) : value 
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const result = await updateEquipment(equipment.id, formData)
    
    if (result.success) {
      setEquipment(prev => prev ? { ...prev, ...formData } : null)
      setIsEditing(false)
      toast.success('Equipment updated successfully!')
    } else {
      toast.error('Failed to update equipment', {
        description: result.error
      })
    }
    setIsSaving(false)
  }

  const handleCancel = () => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        model: equipment.model || '',
        description: equipment.description || '',
        delivery: equipment.delivery || '',
        location: equipment.location || '',
        rate: equipment.rate || 0,
      })
    }
    setIsEditing(false)
  }

  const ownerName = equipment.users 
    ? `${equipment.users.first_name} ${equipment.users.last_name}` 
    : 'Unknown'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div className="w-full">
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs text-gray-500 font-bold uppercase">Equipment Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-2xl font-bold"
              />
            </div>
          ) : (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {formData.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm">
                 <div className="flex items-center">
                    <StarRating rating={equipment.average_rating || 0} size={4} />
                    <span className="ml-2 font-medium text-gray-900">{equipment.average_rating || 0}</span>
                 </div>
                 <span className="text-gray-300">|</span>
                 <span className="text-gray-500">{equipment.total_reviews || 0} reviews</span>
                 <span className="text-gray-300">|</span>
                 <span className="text-gray-500">Owner: {ownerName}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                size="sm"
                className="h-9"
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button 
                onClick={handleSave}
                size="sm"
                className="h-9 bg-green-600 hover:bg-green-700"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                Save
              </Button>
            </>
          ) : (
            isOwner && (
              <Button 
                variant="ghost" 
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-green-700 hover:bg-gray-50"
              >
                <SquarePen className="h-5 w-5"/>
              </Button>
            )
          )}
        </div>
      </div>

      <hr className="my-6 border-gray-100" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        
        <div className="space-y-1">
          <Label className="text-xs text-gray-500 font-bold uppercase tracking-wide">Hourly Rate</Label>
          {isEditing ? (
            <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₱</span>
                <Input 
                    name="rate" 
                    type="number"
                    value={formData.rate} 
                    onChange={handleChange}
                    className="pl-7"
                />
            </div>
          ) : (
            <p className="text-base text-gray-800 font-medium">₱{Number(formData.rate).toLocaleString()}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-500 font-bold uppercase tracking-wide">Model</Label>
          {isEditing ? (
            <Input name="model" value={formData.model} onChange={handleChange} />
          ) : (
            <p className="text-base text-gray-800">{formData.model}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-500 font-bold uppercase tracking-wide">Location</Label>
          {isEditing ? (
            <Input name="location" value={formData.location} onChange={handleChange} />
          ) : (
            <p className="text-base text-gray-800">{formData.location}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-500 font-bold uppercase tracking-wide">Delivery Options</Label>
          {isEditing ? (
            <Input name="delivery" value={formData.delivery} onChange={handleChange} />
          ) : (
            <p className="text-base text-gray-800">{formData.delivery}</p>
          )}
        </div>

      </div>

      <hr className="my-6 border-gray-100" />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-900">Description</Label>
          {isEditing ? (
            <Textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4}
              className="resize-none"
            />
          ) : (
            <p className="text-gray-600 leading-relaxed text-sm">
              {formData.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}