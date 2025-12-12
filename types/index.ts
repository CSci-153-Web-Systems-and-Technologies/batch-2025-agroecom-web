import { LucideIcon } from 'lucide-react';

export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    first_name: string;
    last_name: string,
    confirmed_at: string;
    address: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
}

export interface Equipment {
    id: string;
    name: string;
    model: string;
    description: string;
    image_url: string;
    added_at: string;
    updated_at: string;
    location: string;
    rental_count: number;
}

export interface EquipmentType {
    id: string;
    type: string;
    created_at: string;
}

export interface Reviews {
    id: string;
    user_id: string;
    equipment_id: string;
    rating_count: number,
    comment: string;
    created_at: string;
}

export interface Rentals {
    id: string;
    renter_id: string;
    owner_id: string;
    equipment_id: string;
    status: string;
    start_date: string,
    end_date: string;
    created_at: string;
    updated_at: string;
    duration: string;
}

export interface WriteReview {
    user_id: string;
    equipment_id: string;
    rating_count: string;
    comment: string;
}

export interface StatItem {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconColor?: string 
  valueColor?: string 
}


export interface ReviewData {
  id: string;
  user_id: string;
  equipment_id: string;
  rating_count: number;
  comment: string;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    address: string;
    avatar_url?: string; 
  } | null;
}

export interface ReviewsSectionProps {
  equipmentId: string;
}

export interface ReviewItemProps {
  id: string;
  user_id: string;
  equipment_id: string;
  rating_count: number;
  comment: string;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    address: string;
    avatar_url?: string; 
  } | null;
}

export interface WriteReviewFormProps {
  equipmentId: string;
  onSuccess?: () => void;
}