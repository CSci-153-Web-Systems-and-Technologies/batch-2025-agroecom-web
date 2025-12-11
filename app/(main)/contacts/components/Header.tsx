import Image from "next/image"
export default function AboutHero() {
  return (
    <section 
      className="relative w-full h-[450px] flex flex-col justify-center items-center text-white px-4 text-center"
    >
      <Image
        src="/Hero_bg.jpg"  
        alt="Modern Farming"
        fill
        priority
        className="object-cover object-center hidden brightness-50 md:block"
      />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 font-poppins">
          Contact Us
        </h1>
        <p className="max-w-2xl text-lg md:text-xl font-inter">
          Get in touch and let us know how we can help.
        </p>
      </div>
    </section>
  );
}