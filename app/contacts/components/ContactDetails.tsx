import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Mail, MapPin } from "lucide-react";

export default function ContactDetails()
{
    return (  
        <>
            <Card className="border">
                <CardTitle className="inline-flex justify-start font-semibold px-4">
                    Contact Details:
                </CardTitle>
                <CardContent className="p-4">
                <p className="text-gray-600 mb-6">
                    If you get any question, please consider contacting us. We reply within 24 hours!
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-(--btn-primary) mt-1" />
                        <div>
                            <p className="font-semibold text-gray-700">Email</p>
                            <a 
                            href="mailto:agroecom@gmail.com"
                            className="text-(--btn-primary) hover:underline"
                            >
                            agroecom@gmail.com
                            </a>
                        </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-(--btn-primary) mt-1" />
                        <div>
                            <p className="font-semibold text-gray-700">Address</p>
                            <p className="text-gray-600">Ormoc City</p>
                        </div>
                    </div>
                </div>
                </CardContent>
            </Card>
        </>
    )
}