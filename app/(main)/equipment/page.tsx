import EquipmentSidebar from './components/EquipmentSidebar'
import EquipmentList from './components/EquipmentList'
import AddEquipmentModal from './components/AddEquipmentModal'
import { getEquipmentTypes } from '@/lib/equipment-actions';
import { createClient } from '@/utils/supabase/server'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default async function EquipmentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLender = user?.app_metadata?.role === 'lender';

  const equipmentTypes = await getEquipmentTypes();

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Equipment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 relative">
            {isLender && 
              <div className="relative mb-4 lg:mb-0">
                <AddEquipmentModal/>
              </div>
            }
            <div className="bg-white mt-16 p-6 rounded-lg shadow-sm border h-fit">
              <EquipmentSidebar equipmentTypes={equipmentTypes || []} />
            </div>
          </div>
          <div className="lg:col-span-9">
            <EquipmentList  />
          </div>
        </div>
      </main>
    </>
  );
}