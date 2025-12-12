import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';

export function useUserData() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);
    const role = user?.user_metadata?.role || null;

    return { 
        user, 
        loading, 
        role,
        isFarmer: role === 'farmer',
        isLender: role === 'lender',
        isAdmin: role === 'admin'
    };
}

export default useUserData;