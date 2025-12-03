"use client"

import Image from "next/image";
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { Calendar } from "lucide-react";

export default function SectionCards() {
    const router = useRouter()
  return (
    <>
        <Card className="h-96 px-12 py-3 bg-white rounded-[40px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
           <div className="py-2.5 inline-flex justify-center items-center">
                <Sprout 
                    className="w-30 h-30 text-green-600" 
                />
            </div>
            <CardContent className="h-64 px-2.5 py-2.5 inline-flex flex-col justify-between items-center overflow-hidden">
                <h2 className="text-2xl font-extrabold text-center">Empower Farmers</h2>
                <p className="text-center text-sm text-gray-700 leading-relaxed">
                    Providing access to specialized farming equipment improves productivity and reduces losses caused by lack of manpower or bad timing.
                </p>
                <div className="flex justify-center">
                    <Button 
                    variant="default"
                    className="w-[200px]"
                    onClick={() => {
                        router.push("/");
                    }}>
                        Become a Lender
                    </Button>
                </div>
            </CardContent>
        </Card>
        <Card className="h-96 px-12 py-3 bg-white rounded-[40px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="py-2.5 inline-flex justify-center items-center">
                <Calendar 
                    className="w-30 h-30 text-green-600" 
                />
            </div>
            <CardContent className="h-64 px-2.5 py-2.5 inline-flex flex-col justify-between items-center overflow-hidden">
                <h2 className="text-2xl font-extrabold text-center">Rent Equipment</h2>
                <p className="text-center text-sm text-gray-700 leading-relaxed">
                    Search from a wide selection of farming machines and tools. Farmers can quickly rent the equipment they need without the high cost of ownership.
                </p>
                <div className="flex justify-center">
                    <Button 
                    variant="default"
                    className="w-[200px]"
                    onClick={() => {
                        router.push('/equipment')
                    }}>
                        See more
                    </Button>
                </div>
            </CardContent>
        </Card>
    </>
  );
}