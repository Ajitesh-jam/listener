import { useWhispers, WhisperCategory } from "../lib/stores/useWhispers";

const categoryStyles = {
  frustration: {
    background: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
    icon: "⚡",
    username: "stormynight",
    iconColor: "#fbbf24" // Better contrast yellow for lightning bolt
  },
  regrets: {
    background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
    icon: "��️",
    username: "raindrop47",
    iconColor: "#ffffff"
  },
  thoughts: {
    background: "linear-gradient(135deg, #fbb6ce 0%, #f687b3 100%)",
    icon: "☀️",
    username: "sunnyways",
    iconColor: "#ffffff"
  },
  memories: {
    background: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
    icon: "🍂",
    username: "autumn_soul",
    iconColor: "#ffffff"
  },
  open: {
    background: "linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)",
    icon: "🌅",
    username: "dawnbreaker",
    iconColor: "#ffffff"
  }
};

export default function WhisperStories() {
  const { whispers, setSelectedWhisper } = useWhispers();

  const handleCategoryClick = (category: WhisperCategory) => {
    const categoryWhispers = whispers.filter(w => w.category === category && !w.viewed);
    if (categoryWhispers.length > 0) {
      setSelectedWhisper(categoryWhispers[0]);
    }
  };

  return (
    <div className="px-3 py-2">
      {/* Title aligned to left - more compact */}
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-gray-800">Whispers</h2>
        <p className="text-xs text-gray-500">Anonymous thoughts from IIT Kharagpur Forest</p>
      </div>
      
      {/* Horizontal scrollable container with mobile-standard spacing */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {Object.entries(categoryStyles).map(([category, style]) => {
          const categoryWhispers = whispers.filter(w => w.category === category && !w.viewed);
          const hasUnviewed = categoryWhispers.length > 0;
          
          return (
            <div
              key={category}
              onClick={() => handleCategoryClick(category as WhisperCategory)}
              className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                hasUnviewed ? 'scale-100' : 'scale-95 opacity-60'
              }`}
            >
              <div className="relative">
                {/* Story ring with mobile-standard size */}
                <div className={`w-14 h-14 rounded-full p-0.5 ${
                  hasUnviewed ? 'bg-gradient-to-tr from-pink-500 to-yellow-500' : 'bg-gray-300'
                }`}>
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center text-lg"
                    style={{ background: style.background }}
                  >
                    <span style={{ color: style.iconColor }}>{style.icon}</span>
                  </div>
                </div>
              </div>
              
              {/* Username label with mobile-standard size */}
              <div className="mt-1 w-14 overflow-hidden">
                <p className="text-xs text-center font-medium text-gray-700 truncate">
                  @{style.username}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}