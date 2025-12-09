'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EquipmentToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset to page 1 when changing filters
      if (name !== 'page') {
        params.set('page', '1');
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    router.push(`?${createQueryString(key, value)}`, { scroll: false });
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (searchTerm !== currentSearch) {
        router.push(`?${createQueryString('search', searchTerm)}`, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, router, createQueryString]);

  return (
    <div className="flex flex-row sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="relative grow max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search" 
          className="pl-10 h-10 w-full" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="whitespace-nowrap">Sort by</span>
          <Select 
            value={searchParams.get('sort') || 'popularity'}
            onValueChange={(value) => handleFilterChange('sort', value)}
          >
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue placeholder="Popularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="whitespace-nowrap">View</span>
          <Select 
            value={searchParams.get('limit') || '4'}
            onValueChange={(value) => handleFilterChange('limit', value)}
          >
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue placeholder="4 per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 per page</SelectItem>
              <SelectItem value="8">8 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
