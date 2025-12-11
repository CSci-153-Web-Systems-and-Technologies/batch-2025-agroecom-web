'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { User, Clock, CheckCircle, XCircle, Eye, ChevronRight, ChevronLeft, Shield, UserCog, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useImperativeHandle, forwardRef, useState, useEffect, useCallback } from "react";
import { exportRentals, exportUsers, type ExportFormat } from "@/utils/export";
import { fetchDashboardUsers, fetchDashboardRentals } from "@/lib/dashboard-actions";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

type UserRole = 'lender' | 'admin';
export type RentalStatus = 'all' | 'pending' | 'approved' | 'rejected';
export type UserRoleFilter = 'all' | 'admin' | 'lender' | 'farmer';

export interface RentalData {
  id: string;
  name: string;
  equipment: string;
  date: string;
  duration: string;
  location: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  statusText: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  date: string;
  location: string;
  role: 'admin' | 'lender' | 'farmer';
  roleText: string;
}

interface DashboardTableProps {
  userRole: UserRole;
  statusFilter?: RentalStatus;
  roleFilter?: UserRoleFilter;
  searchQuery?: string;
}

export interface DashboardTableRef {
  exportData: (format?: ExportFormat) => void;
  getFilteredData: () => RentalData[] | UserData[];
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-800';
    case 'lender': return 'bg-blue-100 text-blue-800';
    case 'renter': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return <Shield className="mr-1 h-3 w-3" />;
    case 'lender': return <UserCog className="mr-1 h-3 w-3" />;
    default: return <User className="mr-1 h-3 w-3" />;
  }
};

const DashboardTable = forwardRef<DashboardTableRef, DashboardTableProps>(
  function DashboardTable({ userRole, statusFilter = 'all', roleFilter = 'all', searchQuery = '' }, ref) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<(RentalData | UserData)[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const isAdmin = userRole === 'admin';
  const title = isAdmin ? 'User Accounts' : 'Review';

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const result = await fetchDashboardUsers(currentPage, searchQuery, roleFilter);
        if (result.error) throw new Error(result.error);
        setTableData(result.data as UserData[]);
        setTotalItems(result.total);
      } else {
        const result = await fetchDashboardRentals(currentPage, searchQuery, statusFilter);
        if (result.error) throw new Error(result.error);
        setTableData(result.data as RentalData[]);
        setTotalItems(result.total);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, currentPage, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);


  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  useImperativeHandle(ref, () => ({
    exportData: (format: ExportFormat = 'csv') => {
      if (isAdmin) {
        exportUsers(tableData as UserData[], format);
      } else {
        exportRentals(tableData as RentalData[], format);
      }
    },
    getFilteredData: () => tableData as unknown as UserData[] | RentalData[]
  }), [isAdmin, tableData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>{isAdmin ? 'Role' : 'Status'}</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-8 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <User className="h-8 w-8 mb-2 text-gray-400" />
                      <p className="text-sm font-medium">No {isAdmin ? 'users' : 'rentals'} found</p>
                      <p className="text-xs text-gray-400">Data will appear here when available</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {!isAdmin && 'equipment' in item && (
                            <div className="text-sm text-gray-500">{item.equipment}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{item.date}</div>
                      {!isAdmin && 'duration' in item && (
                        <div className="text-sm text-gray-500">{item.duration}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>{item.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={item.email}>
                        {item.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAdmin && 'role' in item ? (
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(item.role)}`}>
                          {getRoleIcon(item.role)}
                          {item.roleText}
                        </div>
                      ) : (
                        'status' in item && (
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === 'approved' ? 'bg-green-100 text-green-800' :
                            item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                            {item.status === 'approved' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {item.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
                            {item.statusText}
                          </div>
                        )
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-start gap-2">
                        {isAdmin ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1 hover:bg-gray-100"
                            onClick={() => router.push(`${pathname}/user/${item.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1 hover:bg-gray-100"
                            onClick={() => router.push(`${pathname}/renter/${item.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} entries
          </div>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                </PaginationItem>
                
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-1">...</span>
                    ) : (
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!loading) handlePageChange(page as number);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    disabled={currentPage === totalPages || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default DashboardTable;