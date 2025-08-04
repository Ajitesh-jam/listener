import { useState } from "react";
import { X, MessageCircle, Sparkles, Zap, Clock } from "lucide-react";
import ThoughtWriter from "./ThoughtWriter";

interface TapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

export default function TapModal({ isOpen, onClose, onSelectCategory }: TapModalProps) {
  const [showThoughtWriter, setShowThoughtWriter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  if (!isOpen) return null;

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowThoughtWriter(true);
  };

  const handleCloseThoughtWriter = () => {
    setShowThoughtWriter(false);
    setSelectedCategory("");
  };

  const handleSaveThought = (thought: string) => {
    console.log(`Saving ${selectedCategory} thought:`, thought);
    // Here you can add logic to save the thought to your backend
    onSelectCategory(selectedCategory);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-6 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-green-600 mb-2">Choose Your Vibe!</h2>
            <p className="text-gray-500 text-sm">Your reflections are private and safe 🌱</p>
          </div>

          {/* Category Buttons Grid */}
          <div className="px-6 pb-8">
            <div className="grid grid-cols-2 gap-3">
              {/* Top Left - Thoughts */}
              <button
                onClick={() => handleCategorySelect("thoughts")}
                className="bg-blue-500 hover:bg-blue-600 rounded-2xl p-5 flex flex-col items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <MessageCircle size={28} className="mb-2" />
                <span className="font-semibold text-base">Thoughts</span>
              </button>

              {/* Top Right - Memories */}
              <button
                onClick={() => handleCategorySelect("memories")}
                className="bg-purple-500 hover:bg-purple-600 rounded-2xl p-5 flex flex-col items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Sparkles size={28} className="mb-2" />
                <span className="font-semibold text-base">Memories</span>
              </button>

              {/* Bottom Left - Frustrations */}
              <button
                onClick={() => handleCategorySelect("frustration")}
                className="bg-red-500 hover:bg-red-600 rounded-2xl p-5 flex flex-col items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Zap size={28} className="mb-2" />
                <span className="font-semibold text-base">Frustrations</span>
              </button>

              {/* Bottom Right - Regrets */}
              <button
                onClick={() => handleCategorySelect("regrets")}
                className="bg-gray-800 hover:bg-gray-900 rounded-2xl p-5 flex flex-col items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Clock size={28} className="mb-2" />
                <span className="font-semibold text-base">Regrets</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thought Writer Modal */}
      <ThoughtWriter
        isOpen={showThoughtWriter}
        onClose={handleCloseThoughtWriter}
        selectedCategory={selectedCategory}
        onSave={handleSaveThought}
      />
    </>
  );
} 