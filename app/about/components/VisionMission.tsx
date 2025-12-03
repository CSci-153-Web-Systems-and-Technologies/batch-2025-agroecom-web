interface VisionMissionProps {
  type: 'vision' | 'mission';
  content: string;
}

export default function VisionMission({ type, content }: VisionMissionProps) {
  const isVision = type === 'vision';
  
  return (
    <div className="self-stretch min-h-56 p-8 flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
      {isVision ? (
        <>
          <div className="w-full md:w-2/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xl md:text-2xl text-black font-normal font-poppins leading-relaxed text-right">
                {content}
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right">
            <div className="inline-flex flex-col items-end">
              <span className="text-3xl md:text-4xl font-normal text-black font-poppins">OUR</span>
              <span className="text-3xl md:text-4xl text-(--nav-bg) font-bold font-poppins mt-1">
                {type.toUpperCase()}
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full md:w-1/3 text-center md:text-left">
            <div className="inline-flex flex-col items-start">
              <span className="text-3xl md:text-4xl font-normal text-black font-poppins">OUR</span>
              <span className="text-3xl md:text-4xl text-(--nav-bg) font-bold font-poppins mt-1">
                {type.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xl md:text-2xl text-black font-normal font-poppins leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}