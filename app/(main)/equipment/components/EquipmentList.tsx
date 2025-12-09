// import { EquipmentCard } from './EquipmentCard';
// import { getEquipmentList, EquipmentFilters } from '@/lib/equipment-actions'
// import PaginationControl from './PaginationControl';
// import EquipmentToolbar from './EquipmentToolbar';

// interface EquipmentListProps {
//   filters: EquipmentFilters
// }

// export default async function EquipmentList({ filters }: EquipmentListProps) {
//   const { data: equipment, count } = await getEquipmentList(filters)
//   const limit = filters.limit || 4
//   const totalPages = Math.ceil(count / limit)
//   const currentPage = filters.page || 1

//   console.log('Equipment count:', count, '| Limit:', limit, '| Total Pages:', totalPages)

//   return (
//     <section className="space-y-6">
//         <EquipmentToolbar />

//         {equipment.length === 0 ? (
//            <div className="p-10 text-center text-gray-500">
//              No equipment found matching your criteria.
//            </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//                 {equipment.map((item) => (
//                     <EquipmentCard key={item.id} {...item} />
//                 ))}
//             </div>
//             <PaginationControl currentPage={currentPage} totalPages={totalPages} />
//           </>
//         )}
//     </section>
//   )
// }