interface DefinitionSectionProps {
  title: string;
  highlightedText: string;
  description: string;
}

export default function DefinitionSection({ 
  title, 
  highlightedText, 
  description 
}: DefinitionSectionProps) {
  return (
    <div className="self-stretch min-h-56 p-8 flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
      <div className="w-full md:w-1/3 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-normal text-black font-poppins">
          {title}{' '}
          <span className="text-(--nav-bg) font-bold font-poppins">
            {highlightedText}?
          </span>
        </h2>
      </div>
      
      <div className="w-full md:w-2/3">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xl md:text-2xl text-black font-normal font-poppins leading-relaxed">
            <span className="text-(--nav-bg) font-bold font-poppins">
              {highlightedText}
            </span>{' '}
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}