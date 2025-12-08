'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface RentalData {
  id: string;
  name: string;
  lastName?: string;
  equipment: string;
  date: string;
  duration: string;
  location: string;
  email: string;
  phone?: string;
  deliveryLocation?: string;
  returnLocation?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  comment?: string;
  status: 'pending' | 'approved' | 'rejected';
  statusText: string;
}

interface RentalContextType {
  rentals: RentalData[];
  updateRentalStatus: (id: string, status: RentalData['status']) => void;
  getRentalById: (id: string) => RentalData | undefined;
}

const initialRentals: RentalData[] = [
  {
    id: '1',
    name: 'John',
    lastName: 'Doe',
    equipment: 'Tractor X200',
    date: 'Dec 1, 2025',
    duration: '3 days',
    location: 'Manila',
    email: 'john.doe@example.com',
    phone: '+63 912 345 6789',
    deliveryLocation: 'Ormoc City, Leyte',
    returnLocation: 'Ormoc City, Leyte',
    startDate: '2025-12-15',
    startTime: '08:00',
    endDate: '2025-12-20',
    endTime: '17:00',
    comment: 'Please deliver in the morning. I will be available from 8 AM onwards.',
    status: 'pending',
    statusText: 'Pending',
  },
  {
    id: '2',
    name: 'Doe',
    lastName: 'John',
    equipment: 'Tractor X200',
    date: 'Dec 5, 2025',
    duration: '3 days',
    location: 'Manila',
    email: 'doe.john@example.com',
    phone: '+63 917 654 3210',
    deliveryLocation: 'Cebu City',
    returnLocation: 'Cebu City',
    startDate: '2025-12-10',
    startTime: '09:00',
    endDate: '2025-12-13',
    endTime: '18:00',
    comment: 'I need this for my farm work.',
    status: 'pending',
    statusText: 'Pending',
  },
  {
    id: '3',
    name: 'Maria',
    lastName: 'Santos',
    equipment: 'Harvester Pro',
    date: 'Nov 28, 2025',
    duration: '5 days',
    location: 'Davao',
    email: 'maria.santos@example.com',
    phone: '+63 918 111 2222',
    deliveryLocation: 'Davao City',
    returnLocation: 'Davao City',
    startDate: '2025-12-01',
    startTime: '07:00',
    endDate: '2025-12-06',
    endTime: '17:00',
    comment: 'Urgent harvest season.',
    status: 'approved',
    statusText: 'Approved',
  },
  {
    id: '4',
    name: 'Pedro',
    lastName: 'Cruz',
    equipment: 'Plow Machine',
    date: 'Nov 25, 2025',
    duration: '2 days',
    location: 'Iloilo',
    email: 'pedro.cruz@example.com',
    phone: '+63 919 333 4444',
    deliveryLocation: 'Iloilo City',
    returnLocation: 'Iloilo City',
    startDate: '2025-11-27',
    startTime: '06:00',
    endDate: '2025-11-29',
    endTime: '16:00',
    comment: 'Need for land preparation.',
    status: 'rejected',
    statusText: 'Rejected',
  },
];

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<RentalData[]>(initialRentals);

  const updateRentalStatus = (id: string, status: RentalData['status']) => {
    setRentals(prev => prev.map(rental => {
      if (rental.id === id) {
        const statusTextMap: Record<RentalData['status'], string> = {
          pending: 'Pending',
          approved: 'Approved',
          rejected: 'Rejected',
        };
        return {
          ...rental,
          status,
          statusText: statusTextMap[status],
        };
      }
      return rental;
    }));
  };

  const getRentalById = (id: string) => {
    return rentals.find(rental => rental.id === id);
  };

  return (
    <RentalContext.Provider value={{ rentals, updateRentalStatus, getRentalById }}>
      {children}
    </RentalContext.Provider>
  );
}

export function useRentals() {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error('useRentals must be used within a RentalProvider');
  }
  return context;
}
