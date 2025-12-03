import AboutHero from './components/AboutHero';
import DefinitionSection from './components/DefinitionSection';
import VisionMission from './components/VisionMission';
import EquipmentSection from './components/EquipmentSection';
import { ABOUT_CONTENT } from '@/constants/about-content';

export default function AboutPage() {
  return (
    <main className="w-full flex flex-col items-center bg-linear-to-b from-gray-50 to-white text-gray-900 min-h-screen">
      <AboutHero />
      <div className="h-full w-[950px] flex flex-col">
        <DefinitionSection
          title={ABOUT_CONTENT.definition.title}
          highlightedText={ABOUT_CONTENT.definition.highlighted}
          description={ABOUT_CONTENT.definition.description}
        />
      
        <VisionMission
          type="vision"
          content={ABOUT_CONTENT.vision.content}
        />
        
        <VisionMission
          type="mission"
          content={ABOUT_CONTENT.mission.content}
        />
        
        <EquipmentSection />
      </div>
    </main>
  );
}