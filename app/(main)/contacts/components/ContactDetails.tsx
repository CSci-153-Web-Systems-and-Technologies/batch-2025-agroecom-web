import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config" 

export default function ContactDetails() {
    return (
        <Card className="border">
            <CardTitle className="inline-flex justify-start font-semibold px-4 pt-4">
                Contact Details:
            </CardTitle>
            <CardContent className="p-4">
                <p className="text-gray-600 mb-6">
                    If you get any question, please consider contacting us. We reply within 24 hours!
                </p>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-[--btn-primary] mt-1" />
                        <div>
                            <p className="font-semibold text-gray-700">Email</p>
                            {siteConfig.contact.email}
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-[--btn-primary] mt-1" />
                        <div>
                            <p className="font-semibold text-gray-700">Phone</p>
                            {siteConfig.contact.phone}
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-[--btn-primary] mt-1" />
                        <div>
                            <p className="font-semibold text-gray-700">Address</p>
                            <a 
                                href={siteConfig.contact.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="text-gray-600 hover:text-[--btn-primary] hover:underline"
                            >
                                {siteConfig.contact.address}
                            </a>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}