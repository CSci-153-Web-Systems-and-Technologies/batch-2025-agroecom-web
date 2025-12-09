"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import RentRequestForm from "./RentRequestForm";

export default function RentRequestModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="max-w-full w-full hover:bg-(--nav-hover) text-white">
          Rent Equipment
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl w-full p-0 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-xl font-semibold">
            Rent Request Form 
          </DialogTitle>
        </DialogHeader>
        <RentRequestForm />
      </DialogContent>
    </Dialog>
  );
}
