'use client';

import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserData } from '@/lib/user-data';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface EquipmentType {
  id: string;
  name: string;
}

interface EquipmentSidebarProps {
  equipmentTypes: EquipmentType[];
}

export default function EquipmentSidebar({ equipmentTypes }: EquipmentSidebarProps) {
  const { user } = useUserData();
  const userRole = user?.user_metadata?.role || user?.app_metadata?.role || 'farmer';
  const isLender = userRole === 'lender';
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    view: searchParams.get('view') || 'marketplace',
  });

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

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    const defaultView = 'marketplace';

    setFilters({ location: '', type: '', view: defaultView });

    const params = new URLSearchParams(searchParams.toString());
    params.delete('location');
    params.delete('type');
    params.set('view', defaultView); 
    
    router.push(`${pathname}?${params.toString()}`);
  };

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
          onClick={handleApply} 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}