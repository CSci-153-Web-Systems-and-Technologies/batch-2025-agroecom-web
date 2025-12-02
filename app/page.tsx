import HeroSection from "@/components/landing/hero-section"
import SectionCards from "@/components/landing/section-cards"

export default function Home() {
  return (
    <>
    <main className="min-h-screen w-full">
      <HeroSection />
      {/* Cards Section */}
      <div className="relative -mt-20 pb-20 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <SectionCards />
        </div>
      </div>
    </main>
    </>
  );
}
