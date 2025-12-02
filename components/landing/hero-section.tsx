import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative h-[450px] w-full">
        <Image
            src="/hero_bg.jpg"
            alt="Background image"
            fill
            className="object-cover brightness-60"
            priority
        />
        <div className="relative z-10 flex justify-center items-center h-full">
            <h1 className="text-white text-5xl md:text-6xl font-extrabold font-poppins tracking-wide">
            AGROECOM
            </h1>
        </div>
    </div>
  );
}