'use client'

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import Image from 'next/image'
import { addEquipment, getEquipmentTypes } from '@/lib/equipment-actions'

interface EquipmentFormData {
  name: string;
  rate: string;
  model: string; 
  type: string;
  delivery: string;
  description: string;
  location: string;
}

interface AddEquipmentFormProps {
  onSubmit?: () => void; 
  onCancel?: () => void;
  isLoading?: boolean;
}

const INITIAL_STATE = {
  name: '',
  rate: '',
  model: '',
  type: '',
  delivery: '',
  description: '',
  location: '', 
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; 

export default function AddEquipmentForm({ onSubmit, isLoading: parentLoading = false }: AddEquipmentFormProps) {
  const [equipmentTypes, setEquipmentTypes] = useState<{ id: string, name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EquipmentFormData>(INITIAL_STATE);
  
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = parentLoading || isSubmitting;

  useEffect(() => {
    const loadTypes = async () => {
      const types = await getEquipmentTypes();
      if (types) setEquipmentTypes(types);
    }
    loadTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
        toast.error("File is too large. Max size is 5MB.");
        return;
    }
    
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    setSelectedFile(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
        processFile(file);
    }
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedFile(null); 
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const submissionData = new FormData(e.currentTarget);

        if (selectedFile) {
            submissionData.set('image', selectedFile); 
        }

        const result = await addEquipment(submissionData);

        if (result.success) {
            toast.success("Equipment added successfully!");
            setFormData(INITIAL_STATE);
            removeImage();
            if (onSubmit) onSubmit(); 
        } else {
            toast.error(result.message || "Failed to add equipment");
        }
    } catch (error) {
        toast.error("An unexpected error occurred");
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="type_id" value={formData.type} />
      <input type="hidden" name="delivery" value={formData.delivery} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-gray-700 font-medium block">Equipment Name</label>
          <Input
            name="name"
            placeholder="Enter equipment name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium block">
            Hourly Rate <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1.5 text-gray-500">₱</span>
            <Input
              name="rate"
              placeholder="0.00"
              value={formData.rate}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="pl-7 border-gray-300"
              type="number"
              step="0.05"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-gray-700 font-medium block">Model </label>
          <Input
            name="model"
            placeholder="Enter model"
            value={formData.model}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium block">Type</label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {equipmentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    
      <div className="space-y-2">
        <label className="text-gray-700 font-medium block">Location</label>
        <Input
          name="location"
          placeholder="Enter location"
          value={formData.location}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          className="border-gray-300"
        />
      </div>

      <div className="space-y-4">
        <label className="text-gray-700 font-medium block">Upload an image</label>
        
        <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center relative transition-colors duration-200 ${
                isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="relative inline-block">
              <Image
                src={previewUrl}
                alt="Preview"
                className="max-h-48 rounded-lg object-cover mx-auto"
                width={192}
                height={192}
              />
              <Button
                type="button"
                onClick={removeImage}
                disabled={isLoading}
                size="icon"
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="text-gray-600 mb-2">
                {isDragging ? 'Drop image here!' : 'Drag and drop or click to select files.'}
              </div>
              
              <label htmlFor="image-upload" className="cursor-pointer relative z-10">
                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-2">
                    <Upload className="h-4 w-4 mr-2" /> Select Files
                </div>
                <Input
                  id="image-upload"
                  ref={fileInputRef}
                  name="image" 
                  type="file"
                  accept="image/*"
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
              </label>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-gray-700 font-medium block">Delivery <span className="text-red-500">*</span></label>
        <Select
          value={formData.delivery}
          onValueChange={(value) => handleSelectChange('delivery', value)}
          disabled={isLoading}
        >
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Select delivery option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pickup">Pickup</SelectItem>
            <SelectItem value="Delivery">Delivery</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-gray-700 font-medium block">Description</label>
        <Textarea
          name="description"
          placeholder="Enter description..."
          value={formData.description}
          onChange={handleInputChange}
          disabled={isLoading}
          className="min-h-[100px] border-gray-300"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}