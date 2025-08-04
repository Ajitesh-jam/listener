import { useState } from "react";
import { X, Mic, Sparkles } from "lucide-react";
import SaveReflectionModal from "./SaveReflectionModal";

interface ThoughtWriterProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSave: (thought: string) => void;
}

const categoryConfig = {
  thoughts: {
    title: "Thoughts",
    subtitle: "Write freely, let your thoughts flow naturally...",
    placeholder: "What's on your mind today? Be honest, be you...",
    color: "text-blue-600",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    bgGradient: "from-blue-50 to-blue-100"
  },
  memories: {
    title: "Memories",
    subtitle: "Capture those precious moments that matter...",
    placeholder: "What memory do you want to cherish today?",
    color: "text-purple-600",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    bgGradient: "from-purple-50 to-purple-100"
  },
  frustration: {
    title: "Frustrations",
    subtitle: "Let it all out, release what's weighing you down...",
    placeholder: "What's frustrating you? Get it off your chest...",
    color: "text-red-600",
    buttonColor: "bg-red-500 hover:bg-red-600",
    bgGradient: "from-red-50 to-red-100"
  },
  regrets: {
    title: "Regrets",
    subtitle: "Reflect and release, find peace in letting go...",
    placeholder: "What do you wish you could change? Be gentle with yourself...",
    color: "text-gray-700",
    buttonColor: "bg-gray-700 hover:bg-gray-800",
    bgGradient: "from-gray-50 to-gray-100"
  }
};

export default function ThoughtWriter({ isOpen, onClose, selectedCategory, onSave }: ThoughtWriterProps) {
  const [thought, setThought] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const config = categoryConfig[selectedCategory as keyof typeof categoryConfig];

  if (!isOpen || !config) return null;

  const handleNext = () => {
    if (thought.trim()) {
      setShowSaveModal(true);
    }
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
  };

  const handleSavePrivate = (thoughtText: string) => {
    console.log("Saving private thought:", thoughtText);
    onSave(thoughtText);
    setThought("");
    onClose();
  };

  const handleShareWhisper = (thoughtText: string) => {
    console.log("Sharing whisper:", thoughtText);
    onSave(thoughtText);
    setThought("");
    onClose();
  };

  const handleVoiceInput = () => {
    // Voice input functionality can be added here
    console.log("Voice input activated");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className={`bg-gradient-to-br ${config.bgGradient} rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 border border-white/20`}>
          {/* Header */}
          <div className="p-6 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white"
            >
              <X size={18} />
            </button>
            <h2 className={`text-xl font-bold ${config.color} mb-2`}>{config.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{config.subtitle}</p>
          </div>

          {/* Text Input Area */}
          <div className="px-6 pb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/50">
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder={config.placeholder}
                className="w-full h-48 p-4 bg-transparent border-none rounded-2xl resize-none focus:outline-none text-gray-800 placeholder-gray-500 text-base leading-relaxed"
                autoFocus
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6">
            <div className="flex gap-3">
              <button
                onClick={handleVoiceInput}
                className="flex-1 bg-white/90 backdrop-blur-sm border border-white/50 hover:bg-white text-gray-700 rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Mic size={20} />
                <span className="font-semibold text-sm">Voice</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!thought.trim()}
                className={`flex-1 ${config.buttonColor} text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="font-semibold text-sm">Next</span>
                <Sparkles size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Reflection Modal */}
      <SaveReflectionModal
        isOpen={showSaveModal}
        onClose={handleCloseSaveModal}
        thought={thought}
        category={selectedCategory}
        onSavePrivate={handleSavePrivate}
        onShareWhisper={handleShareWhisper}
      />
    </>
  );
} 