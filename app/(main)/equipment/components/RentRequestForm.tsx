"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitRentalRequest, RentalRequestData } from "@/lib/rental-actions"; 
import { createClient } from "@/utils/supabase/client"; 
import { toast } from "sonner"; 
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Info,
  Loader2,
  Send
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from 'next/navigation';

import { useUserData } from "@/lib/user-data"; 

interface RentRequestFormProps {
  ownerId?: string;      
  equipmentId?: string;  
}

export default function RentRequestForm({ ownerId: propOwnerId, equipmentId: propEquipmentId }: RentRequestFormProps) {
  const params = useParams();
  const equipmentId = propEquipmentId || (params.id as string); 

  const { user, loading: userLoading } = useUserData();
  
  const [submitting, setSubmitting] = useState(false);
  const [equipmentLoading, setEquipmentLoading] = useState(true);
  
  const [ownerId, setOwnerId] = useState(propOwnerId || "");
  const [equipmentName, setEquipmentName] = useState(""); 
  
  const [todayDate, setTodayDate] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    delivery: "",
    returnLocation: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    message: "",
  });

  const getLocalNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`
    };
  };

  useEffect(() => {
    if (user && !userLoading) {
        const metadata = user?.user_metadata;
        const firstname = metadata?.first_name || metadata?.full_name?.split(' ')[0] || "";
        const lastname = metadata?.last_name || metadata?.full_name?.split(' ').slice(1).join(' ') || "";
        const contactNumber = metadata?.contact_number || user.phone || "";

        setForm(prev => ({
          ...prev,
          firstName: firstname || "",
          lastName: lastname || "",
          email: user.email || "",
          contact: contactNumber
        }));
    }
  }, [user, userLoading]);

  useEffect(() => {
    setTodayDate(getLocalNow().date);

    async function fetchEquipmentData() {
      if (propOwnerId && equipmentName) {
         setEquipmentLoading(false);
         return;
      }

      const supabase = createClient();
      
      if (equipmentId) {
        const { data: equipment, error: eqError } = await supabase
          .from('equipment')
          .select('user_id, name')
          .eq('id', equipmentId)
          .single();

        if (equipment && !eqError) {
          if (!propOwnerId) setOwnerId(equipment.user_id);
          setEquipmentName(equipment.name);
        }
      }
      setEquipmentLoading(false);
    }

    fetchEquipmentData();
  }, [equipmentId, propOwnerId, equipmentName]);


  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = e.target;
    
    const updatedForm = { ...form, [name]: value };

    if (name === 'startDate') {
        const { date: currentLocal, time: currentTime } = getLocalNow();
        
        if (value < currentLocal) {
            updatedForm.startDate = currentLocal;
            updatedForm.startTime = currentTime;
            
            toast.info("Date Adjusted", {
                description: "Pickup cannot be in the past. We've set it to right now.",
            });
        }
    }

    setForm(updatedForm);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!ownerId) {
        toast.error("Owner information is missing. Cannot proceed.");
        return;
    }

    if (form.startDate && form.startTime && form.endDate && form.endTime) {
        const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
        const endDateTime = new Date(`${form.endDate}T${form.endTime}`);

        if (endDateTime <= startDateTime) {
            toast.error("Invalid Rental Duration", {
                description: "The return date and time cannot be earlier than or the same as the pickup date and time.",
            });
            return; 
        }
    } else {
         toast.error("Missing Dates", {
            description: "Please select both start and end dates and times."
         });
         return;
    }

    setSubmitting(true);

    try {
      const result = await submitRentalRequest(form as unknown as RentalRequestData, equipmentId, ownerId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Rental request submitted successfully!");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  // Combined loading state
  if (userLoading || equipmentLoading) {
    return <FormSkeleton />;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {equipmentName && (
        <div className="mb-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-500" />
          <p className="text-sm text-slate-700">
            You are requesting to rent: <span className="font-bold text-blue-700">{equipmentName}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <UserIcon className="w-5 h-5" />
            <h3 className="font-semibold text-sm uppercase tracking-wide">Renter Information</h3>
            <div className="ml-auto" title="These details are pulled from your profile">
                <Info className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
               <Label className="text-xs text-slate-500">Full Name</Label>
               <div className="relative">
                 <Input 
                    value={`${form.firstName} ${form.lastName}`} 
                    readOnly 
                    className="pl-9 bg-white text-slate-700 font-medium border-slate-200 focus-visible:ring-0 cursor-default"
                 />
                 <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
               </div>
            </div>

            <div className="space-y-1.5">
               <Label className="text-xs text-slate-500">Email Address</Label>
               <div className="relative">
                 <Input 
                    value={form.email} 
                    readOnly 
                    className="pl-9 bg-white text-slate-700 font-medium border-slate-200 focus-visible:ring-0 cursor-default"
                 />
                 <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
               </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
               <Label className="text-xs text-slate-500">Contact Number</Label>
               <div className="relative">
                 <Input 
                    name="contact"
                    value={form.contact} 
                    onChange={handleChange}
                    placeholder="e.g. 0917 123 4567"
                    className="pl-9 bg-white border-slate-200"
                    required
                 />
                 <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
               </div>
               <p className="text-[10px] text-slate-400">We&apos;ll use this number to coordinate delivery.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-sm">Pickup Details</h3>
                </div>

                <div className="space-y-3">
                    <div>
                        <Label className="text-xs mb-1.5 block">Date & Time</Label>
                        <div className="flex gap-2">
                            <Input 
                                type="date" 
                                name="startDate" 
                                value={form.startDate} 
                                onChange={handleChange} 
                                required 
                                min={todayDate} 
                                className="flex-1" 
                            />
                            <Input 
                                type="time" 
                                name="startTime" 
                                value={form.startTime} 
                                onChange={handleChange} 
                                required 
                                className="w-24" 
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs mb-1.5 block">Delivery Location</Label>
                        <div className="relative">
                            <Input name="delivery" value={form.delivery} onChange={handleChange} required className="pl-9" placeholder="Enter address" />
                            <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <h3 className="font-semibold text-sm">Return Details</h3>
                </div>

                <div className="space-y-3">
                    <div>
                        <Label className="text-xs mb-1.5 block">Date & Time</Label>
                        <div className="flex gap-2">
                            <Input 
                                type="date" 
                                name="endDate" 
                                value={form.endDate} 
                                onChange={handleChange} 
                                required 
                                min={form.startDate || todayDate} 
                                className="flex-1" 
                            />
                            <Input 
                                type="time" 
                                name="endTime" 
                                value={form.endTime} 
                                onChange={handleChange} 
                                required 
                                className="w-24" 
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs mb-1.5 block">Return Location</Label>
                        <div className="relative">
                            <Input name="returnLocation" value={form.returnLocation} onChange={handleChange} required className="pl-9" placeholder="Enter address" />
                            <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-3 pt-2">
          <Label className="text-sm font-medium">Additional Notes</Label>
          <Textarea 
            name="message"
            className="min-h-[100px] resize-none border-slate-200 focus:border-primary" 
            placeholder="Any specific instructions for delivery or questions about the equipment?"
            value={form.message} 
            onChange={handleChange} 
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={submitting || !ownerId}
          className="w-full h-11 text-base font-medium shadow-md transition-all active:scale-[0.99]"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Request...
            </>
          ) : (
            <>
              Submit Rental Request <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function FormSkeleton() {
    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 h-48 space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <Skeleton className="h-12 w-full mt-8" />
        </div>
    )
}