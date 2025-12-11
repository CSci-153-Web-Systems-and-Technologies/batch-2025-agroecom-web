import Image from 'next/image';
import Link from 'next/link';

export default function EquipmentSection() {
  return (
    <div className="self-stretch min-h-48 p-8 flex flex-col md:flex-row justify-between items-center gap-8 mb-8 rounded-xl">
      <div className="w-full md:w-1/3 flex justify-center">
        <div className="relative w-64 h-48">
          <Image
            src="/tractor.png"
            alt="Tractor"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 256px"
          />
        </div>
      </div>
      
      <div className="w-full md:w-2/3">
        <div className="text-center md:text-left">
          <p className="text-2xl md:text-3xl text-black font-normal font-poppins leading-relaxed">
            We offer thousands of equipment.{' '}
            <Link 
              href="/equipment" 
              className="text-(--nav-bg) font-bold underline hover:text-(--btn-primary) transition-colors duration-300 font-poppins"
              aria-label="Browse and rent equipment"
            >
              Rent yours now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}