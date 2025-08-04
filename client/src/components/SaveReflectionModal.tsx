import { useState } from "react";
import { X, Lock, Send } from "lucide-react";

interface SaveReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  thought: string;
  category: string;
  onSavePrivate: (thought: string) => void;
  onShareWhisper: (thought: string) => void;
}

const categoryConfig = {
  thoughts: {
    title: "Save Your Thoughts",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-blue-100"
  },
  memories: {
    title: "Save Your Memory",
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-purple-100"
  },
  frustration: {
    title: "Save Your Frustration",
    color: "text-red-600",
    bgGradient: "from-red-50 to-red-100"
  },
  regrets: {
    title: "Save Your Reflection",
    color: "text-gray-700",
    bgGradient: "from-gray-50 to-gray-100"
  }
};

export default function SaveReflectionModal({ 
  isOpen, 
  onClose, 
  thought, 
  category, 
  onSavePrivate, 
  onShareWhisper 
}: SaveReflectionModalProps) {
  const config = categoryConfig[category as keyof typeof categoryConfig];

  if (!isOpen || !config) return null;

  const handleSavePrivate = () => {
    onSavePrivate(thought);
    onClose();
  };

  const handleShareWhisper = () => {
    onShareWhisper(thought);
    onClose();
  };

  return (
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
          <p className="text-gray-600 text-sm leading-relaxed">Choose how you'd like to save this moment:</p>
        </div>

        {/* Thought Preview */}
        <div className="px-6 pb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
            <p className="text-gray-800 text-sm leading-relaxed italic">
              "{thought}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-3">
          {/* Save Private Button */}
          <button
            onClick={handleSavePrivate}
            className="w-full bg-white/90 backdrop-blur-sm border border-white/50 hover:bg-white text-gray-700 rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Lock size={20} />
            <span className="font-semibold text-sm">Save Only (Private)</span>
          </button>

          {/* Share Whisper Button */}
          <button
            onClick={handleShareWhisper}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send size={20} />
            <span className="font-semibold text-sm">Post as Whisper (Share Anonymously)</span>
          </button>

          {/* Info Text */}
          <p className="text-gray-500 text-xs text-center mt-3">
            Whispers are shared anonymously in your forest community
          </p>
        </div>
      </div>
    </div>
  );
} 