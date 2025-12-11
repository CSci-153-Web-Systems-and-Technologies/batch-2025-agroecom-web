import { CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function SignupLoginHero() {
  const features = [
    "Easy Transaction",
    "Variety of farming equipment",
    "Improve Productivity",
    "Reduce Overall Cost"
  ]

  return (
    <div className="relative hidden h-full flex-col justify-center items-center bg-black p-12 text-white lg:col-span-3 lg:flex">
      
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/Hero_bg.jpg"
          alt="Modern Farming"
          fill
          priority
          className="object-cover object-center opacity-50" 
          quality={90}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="relative z-20 max-w-lg w-full">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight font-poppins">
          AGROECOM
        </h1>
        
        <p className="text-lg font-medium mb-12 leading-relaxed text-gray-200">
          A dedicated marketplace for farmers who want to rent farming equipment efficiently and affordably.
        </p>

        <ul className="space-y-5">
          {features.map((item, index) => (
            <li key={index} className="flex items-center text-lg font-medium">
              <CheckCircle className="w-6 h-6 mr-4 text-(--nav-hover) shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}