'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PersonalInfoSkeleton from "../../../components/PersonalInfoSkeleton"
import AccountInfoSkeleton from "../../../components/AccountInformationSkeleton"
import PersonalInfo from "@/app/(main)/dashboard/components/PersonalInfo"
import AccountInformation from "@/app/(main)/dashboard/components/AccountInformation"
import { getUserDetails, UserDetails } from '@/lib/dashboard-actions';
import { adminDeleteUser } from '@/lib/admin-actions'
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function UserProfileReadOnly() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
    const [userData, setUserData] = useState<UserDetails | null>(null);
    
    useEffect(() => {
        async function fetchUser() {
            if (!userId) return;
            
            setLoading(true);
            const { data, error } = await getUserDetails(userId);
            
            if (error) {
                toast.error("Failed to fetch user details");
                console.error(error);
            } else {
            if (data) {
                console.log("Fetched User Data:", data);
                console.log("Attempting to access:",data.first_name);
            }
                setUserData(data);
            }
            setLoading(false);
        }
        fetchUser();
    }, [userId]);
    
    const handleDeleteAccount = async () => {
        const { error } = await adminDeleteUser(userId);
        
        if (error) {
            toast.error("Failed to delete user");
            console.error(error);
        } else {
            toast.success("User deleted successfully");
            setIsDeleteDialogOpen(false);
            router.push('/dashboard/admin/'); 
        }
    };

    if (loading) {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        <PersonalInfoSkeleton />
        <AccountInfoSkeleton />
      </div>
    </div>
  );
}

    if (!userData) {
        return <div className="p-6 text-center">User not found</div>;
    }

    let accountAge = 'Unknown';
    if (userData.created_at) {
        try {
            accountAge = formatDistanceToNow(new Date(userData.created_at), { addSuffix: true });
        } catch (e) {
            console.error("Date parsing error", e);
        }
    }

    const formData = {
        username: userData.username || '',
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        role: userData.role || 'farmer',
        accountAge: accountAge,
        subscription: userData.subscription || 'free',
        contactNumber: userData.contact_number || '',
        address: userData.address || '',
        avatarUrl: userData.avatar_url || ''
    };

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-6">
                <PersonalInfo 
                    editable={false}
                    {...formData}
                />
                <AccountInformation 
                    initialData={{
                        role: formData.role,
                        accountAge: formData.accountAge,
                        subscription: formData.subscription,
                    }}
                />
                    <div className="pt-4">
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="w-full md:w-auto font-(--font-geist-sans) cursor-pointer"
                                >
                                    Delete Account
                                </Button>
                            </DialogTrigger>
                            
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
                            <div className="p-6">
                                <div className="mt-4 space-y-2">
                                    <DialogTitle className="text-lg font-semibold">Delete Account?</DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500">
                                        Deleting this account is irreversible and will erase all the user&apos;s data. This action cannot be undone.
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50 space-x-2">
                                <Button 
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    variant="outline"
                                    className="font-(--font-geist-sans) cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleDeleteAccount}
                                    variant="destructive"
                                    className="font-(--font-geist-sans) cursor-pointer" 
                                >
                                    Continue
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}