'use client';

import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react'; 
import { RotateCcw } from 'lucide-react';

import { useUserData } from '@/lib/user-data'; 

interface EquipmentType {
  id: string;
  name: string;
}

interface EquipmentSidebarProps {
  equipmentTypes: EquipmentType[];
}

export default function EquipmentSidebar({ equipmentTypes }: EquipmentSidebarProps) {
    const { isLender, loading } = useUserData(); 
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlLocation = searchParams.get('location') || '';
    const urlType = searchParams.get('type') || '';
    const urlView = searchParams.get('view') || 'marketplace';

    const [filters, setFilters] = useState({
        location: urlLocation,
        type: urlType,
        view: urlView,
    });

    const [prevUrlParams, setPrevUrlParams] = useState({
        location: urlLocation,
        type: urlType,
        view: urlView,
    });

    if (
        urlLocation !== prevUrlParams.location ||
        urlType !== prevUrlParams.type ||
        urlView !== prevUrlParams.view
    ) {

        setPrevUrlParams({
            location: urlLocation,
            type: urlType,
            view: urlView,
        });

        setFilters({
            location: urlLocation,
            type: urlType,
            view: urlView,
        });
    }

    const isFilterActive = !!urlLocation || !!urlType || urlView !== 'marketplace';
    
    const hasPendingChanges = 
        filters.location !== urlLocation || 
        filters.type !== urlType || 
        filters.view !== urlView;

    const handleLocalChange = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === 'all' ? '' : value
        }));
    };

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (filters.location) params.set('location', filters.location);
        else params.delete('location');

        if (filters.type) params.set('type', filters.type);
        else params.delete('type');

        if (filters.view) params.set('view', filters.view);
        else params.delete('view');

        params.set('page', '1');

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleReset = () => {
        const defaultView = 'marketplace';
        setFilters({ location: '', type: '', view: defaultView });

        const params = new URLSearchParams(searchParams.toString());
        params.delete('location');
        params.delete('type');
        params.set('view', defaultView);
        params.set('page', '1');
        
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleToggleFilter = () => {
        if (hasPendingChanges) {
            handleApply();
        } else if (isFilterActive) {
            handleReset();
        } else {
            handleApply();
        }
    };

    if (loading) {
        return (
            <div className="w-full space-y-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-700">Filter</h2>
                <button 
                    onClick={handleReset} 
                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                >
                    <RotateCcw className="w-3 h-3" /> Reset
                </button>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                <Select 
                    value={filters.location || 'all'} 
                    onValueChange={(val) => handleLocalChange('location', val)}
                >
                    <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Ormoc">Ormoc</SelectItem>
                        <SelectItem value="Kananga">Kananga</SelectItem>
                        <SelectItem value="Isabel">Isabel</SelectItem>
                        <SelectItem value="Baybay">Baybay</SelectItem>
                        <SelectItem value="Albuera">Albuera</SelectItem>
                        <SelectItem value="Tacloban">Tacloban</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                <Select 
                    value={filters.type || 'all'} 
                    onValueChange={(val) => handleLocalChange('type', val)}
                >
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {equipmentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                                {type.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLender && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">View</Label>
                    <div className="flex gap-2">
                        <Toggle 
                            pressed={filters.view === 'my-equipment'}
                            onPressedChange={() => handleLocalChange('view', 'my-equipment')}
                            className="flex-1 border data-[state=on]:bg-green-100 data-[state=on]:text-green-900"
                        >
                            My Equipment
                        </Toggle>
                        <Toggle 
                            pressed={filters.view === 'marketplace'}
                            onPressedChange={() => handleLocalChange('view', 'marketplace')}
                            className="flex-1 border data-[state=on]:bg-green-100 data-[state=on]:text-green-900"
                        >
                            Marketplace
                        </Toggle>
                    </div>
                </div>
            )}

            <div className="pt-2">
                <Button 
                    onClick={handleToggleFilter} 
                    variant={isFilterActive || hasPendingChanges ? "default" : "outline"}
                    className="w-full"
                >
                    {hasPendingChanges ? "Apply Filters" : (isFilterActive ? "Clear Filters" : "Apply Filters")}
                </Button>
            </div>
        </div>
    );
}