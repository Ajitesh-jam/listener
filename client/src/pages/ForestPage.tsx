import { useState } from "react";
import { TreePine, Plus, Check } from "lucide-react";
import NavigationBar from "../components/NavigationBar";

interface Forest {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  description: string;
  members: number;
  growthPercentage: number;
  isJoined: boolean;
}

const forests: Forest[] = [
  {
    id: "1",
    name: "IIT Kharagpur Forest",
    category: "College",
    categoryColor: "bg-blue-500",
    description: "Connect with fellow KGPians and grow together",
    members: 1250,
    growthPercentage: 75,
    isJoined: true
  },
  {
    id: "2",
    name: "BTech Forest",
    category: "Education",
    categoryColor: "bg-purple-500",
    description: "Engineering students supporting each other",
    members: 3400,
    growthPercentage: 68,
    isJoined: false
  },
  {
    id: "3",
    name: "Global Forest",
    category: "Global",
    categoryColor: "bg-green-500",
    description: "A worldwide community of reflective souls",
    members: 15670,
    growthPercentage: 82,
    isJoined: false
  },
  {
    id: "4",
    name: "Tech Professionals",
    category: "Professional",
    categoryColor: "bg-orange-500",
    description: "Software engineers and tech workers",
    members: 2100,
    growthPercentage: 71,
    isJoined: false
  }
];

function ForestCard({ forest, onToggleJoin }: { forest: Forest; onToggleJoin: (id: string) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 relative hover:shadow-xl transition-all duration-200">
      {/* Tree Icon - Positioned outside top-right corner */}
      <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg">
        <TreePine size={20} className="text-white" />
      </div>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-800">{forest.name}</h3>
            <span className={`${forest.categoryColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
              {forest.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{forest.description}</p>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="mb-5">
        <div className="text-sm text-gray-700 mb-1">
          <span className="font-semibold">{forest.members.toLocaleString()} members</span>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{forest.growthPercentage}% avg growth</span>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onToggleJoin(forest.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            forest.isJoined
              ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
              : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
          }`}
        >
          {forest.isJoined ? (
            <>
              <Check size={16} />
              <span>Joined</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Join</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ForestPage() {
  const [forestList, setForestList] = useState<Forest[]>(forests);

  const handleToggleJoin = (forestId: string) => {
    setForestList(prev => 
      prev.map(forest => 
        forest.id === forestId 
          ? { ...forest, isJoined: !forest.isJoined }
          : forest
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-green-50 to-amber-50">
      {/* Fixed Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-green-100 px-6 py-6 flex-shrink-0">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Discover Your Forest
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Join communities where your tree grows alongside others
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {forestList.map((forest) => (
            <ForestCard
              key={forest.id}
              forest={forest}
              onToggleJoin={handleToggleJoin}
            />
          ))}
        </div>
      </div>

      {/* Fixed Navigation Bar */}
      <div className="flex-shrink-0">
        <NavigationBar />
      </div>
    </div>
  );
}
