import { CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function SignupLoginHero()
{
    return (
        <div className="relative overflow-hidden bg-black text-white hidden lg:col-span-3 lg:flex flex-col justify-center items-center p-12 lg:p-30">
        <Image
            src="/Hero_bg.jpg"  
            alt="Modern Farming"
            fill
            priority
            className="object-cover object-center hidden brightness-50 md:block"
            quality={90}
        />
        <div className="relative z-20 max-w-sm">
          <h1 className="text-6xl font-normal mb-4 tracking-tight">
            AGROECOM
          </h1>
          <p className="text-base font-bold mb-20 leading-6 text-gray-200">
            A dedicated marketplace for farmers who wants to rent farming equipments
          </p>

          <ul className="space-y-3">
            <li className="flex items-center text-base font-normal">
              <CheckCircle className="w-5 h-5 mr-3 text-nav-hover" /> {/* Assuming nav-hover is the highlight color */}
              Easy Transaction
            </li>
            <li className="flex items-center text-base font-normal">
              <CheckCircle className="w-5 h-5 mr-3 text-nav-hover" />
              Variety of farming equipment
            </li>
            <li className="flex items-center text-base font-normal">
              <CheckCircle className="w-5 h-5 mr-3 text-nav-hover" />
              Improve Productivity
            </li>
            <li className="flex items-center text-base font-normal">
              <CheckCircle className="w-5 h-5 mr-3 text-nav-hover" />
              Reduce Overall Cost
            </li>
          </ul>
        </div>
      </div>
    )
}