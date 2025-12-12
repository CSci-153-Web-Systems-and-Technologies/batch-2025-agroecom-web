"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import PersonalInfoSkeleton from "./PersonalInfoSkeleton"
import { Loader2, Camera, Pencil } from "lucide-react"

interface FormDataState {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  avatarUrl: string;
  contactNumber: string;
}

interface PersonalInfoProps {
  editable?: boolean
  username?: string
  firstName?: string
  lastName?: string
  email?: string
  address?: string
  avatarUrl?: string
  contactNumber?: string
  userId?: string 
}

export default function PersonalInfo({
  editable = true,
  username,
  firstName,
  lastName,
  email,
  address,
  avatarUrl,
  contactNumber,
  userId: propUserId
}: PersonalInfoProps) {
  
  const [isEditing, setIsEditing] = useState(false)
  
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [userId, setUserId] = useState<string | null>(propUserId || null)
  const [currentAuthUserId, setCurrentAuthUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormDataState>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    avatarUrl: "",
    contactNumber: ""
  })

  const [originalData, setOriginalData] = useState<FormDataState>(formData)

  const supabase = createClient()

  const canEdit = editable && (currentAuthUserId === userId);

  useEffect(() => {
    if (email || username || firstName || propUserId) {
        const dataFromProps: FormDataState = {
            username: username || "",
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || "",
            address: address || "",
            avatarUrl: avatarUrl || "",
            contactNumber: contactNumber || ""
        }
        
        setFormData(dataFromProps)
        setOriginalData(dataFromProps)
        setUserId(propUserId || null)
        setLoading(false)
        return; 
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            setLoading(false);
            return; 
        }

        setCurrentAuthUserId(user.id)
        setUserId(user.id) 

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, first_name, last_name, avatar_url, address, contact_number')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') { 
          console.error('Error fetching profile:', error)
          toast.error("Could not load profile data")
        }

        const initialData: FormDataState = {
          username: profile?.username || "",
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
          address: profile?.address || "", 
          email: user.email || "", 
          avatarUrl: profile?.avatar_url || "",
          contactNumber: profile?.contact_number || ""
        }
        
        setFormData(initialData)
        setOriginalData(initialData)
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [username, firstName, lastName, email, address, avatarUrl, contactNumber, propUserId, supabase]) 


  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSave = async () => {
    if (!userId || !canEdit) {
       toast.error("Cannot save: Missing User ID or Unauthorized");
       return;
    }

    try {
      setLoading(true) 

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address, 
          contact_number: formData.contactNumber, 
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setOriginalData(formData)
      setIsEditing(false) 
      toast.success("Profile updated successfully")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }


  const handleUploadClick = () => {
    if (canEdit) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId || !canEdit) return

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file")
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error("Image must be less than 5MB")
      return
    }

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-avatar-${Date.now()}.${fileExt}` 
      
      const { error: uploadError } = await supabase.storage
        .from('avatars') 
        .upload(fileName, file, { upsert: true }) 

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })

      if (updateError) throw updateError

      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }))
      setOriginalData(prev => ({ ...prev, avatarUrl: publicUrl }))
      
      toast.success("Profile picture updated")
    } catch (error) {
      console.error(error)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const getInitials = () => {
    const first = formData.firstName ? formData.firstName[0] : ""
    const last = formData.lastName ? formData.lastName[0] : ""
    return (first + last).toUpperCase() || formData.email?.slice(0, 2).toUpperCase() || "U"
  }

  if (loading && !formData.email) {
    return <PersonalInfoSkeleton />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="text-xl font-semibold">
          Personal Information
        </div>

        {canEdit && !isEditing && (
            <Button onClick={handleEditClick} variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-2" />
                Edit Details
            </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex items-center space-x-4">
          <div className="relative group/avatar">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={formData.avatarUrl} 
                alt="User Avatar" 
                className="object-cover" 
              /> 
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>

            {canEdit && (
                <div 
                    onClick={handleUploadClick}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                    title="Change Profile Picture"
                >
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <Camera className="h-6 w-6 text-white" />
                    )}
                </div>
            )}
          </div>

          {canEdit && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <Input 
              id="username" 
              value={formData.username}
              onChange={handleInputChange}
              readOnly={!isEditing} 
              className={`${!isEditing ? 'bg-muted' : ''}`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <Input 
              id="email" 
              value={formData.email}
              readOnly={true} 
              className="bg-muted text-muted-foreground cursor-not-allowed"
              title="Email cannot be changed here"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`${!isEditing ? 'bg-muted' : ''}`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`${!isEditing ? 'bg-muted' : ''}`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contactNumber" className="block text-sm font-medium">Contact Number</label>
            <Input 
              id="contactNumber" 
              value={formData.contactNumber}
              onChange={handleInputChange}
              readOnly={!isEditing}
              placeholder="e.g. 0912 345 6789"
              className={`${!isEditing ? 'bg-muted' : ''}`}
            />
          </div>
          
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium">Address</label>
            <Input 
              id="address" 
              value={formData.address}
              onChange={handleInputChange}
              readOnly={!isEditing}
              placeholder="123 Farmville Road, Barangay Sta. Cruz"
              className={`${!isEditing ? 'bg-muted' : ''}`}
            />
          </div>

        </div>

        {canEdit && isEditing && ( 
          <div className="flex justify-end space-x-2">
            <Button 
              onClick={handleCancel}
              variant="outline"
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="px-6"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              Save changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}