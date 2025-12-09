
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import EquipmentForm from './EquipmentForm'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function AddEquipmentModal() {
 return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full hover:bg-(--nav-hover) lg:absolute lg:top-0 lg:z-10">
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">Add Equipment</DialogTitle>
            <EquipmentForm />            
        </DialogHeader>
      </DialogContent>  
    </Dialog>
  );
}