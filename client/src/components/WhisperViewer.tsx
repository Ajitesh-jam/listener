import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Share, MessageCircle } from "lucide-react";
import { useWhispers, Whisper } from "../lib/stores/useWhispers";
import ShareWhisperModal from "./ShareWhisperModal";

interface WhisperViewerProps {
  whisper: Whisper;
  onClose: () => void;
}

// Reaction categories with custom messages
const reactionCategories = {
  relatable: {
    title: "Relatable",
    reactions: [
      { text: "Feel it too", emoji: "", color: "bg-blue-500 hover:bg-blue-600" },
      { text: "Same here", emoji: "", color: "bg-blue-500 hover:bg-blue-600" },
      { text: "Been there", emoji: "", color: "bg-blue-500 hover:bg-blue-600" },
      { text: "Relatable af", emoji: "", color: "bg-blue-500 hover:bg-blue-600" },
      { text: "This hits home", emoji: "", color: "bg-blue-500 hover:bg-blue-600" },
      { text: "I get it", emoji: "", color: "bg-blue-500 hover:bg-blue-600" }
    ]
  },
  appreciative: {
    title: "Appreciative",
    reactions: [
      { text: "Beautiful", emoji: "✨", color: "bg-purple-500 hover:bg-purple-600" },
      { text: "Love this", emoji: "❤️", color: "bg-purple-500 hover:bg-purple-600" },
      { text: "So true", emoji: "✅", color: "bg-purple-500 hover:bg-purple-600" },
      { text: "Well said", emoji: "👏", color: "bg-purple-500 hover:bg-purple-600" },
      { text: "Beautifully written", emoji: "✍️", color: "bg-purple-500 hover:bg-purple-600" },
      { text: "This resonates", emoji: "🎵", color: "bg-purple-500 hover:bg-purple-600" }
    ]
  },
  supportive: {
    title: "Supportive",
    reactions: [
      { text: "You got this", emoji: "", color: "bg-green-500 hover:bg-green-600" },
      { text: "Stay strong", emoji: "", color: "bg-green-500 hover:bg-green-600" },
      { text: "Sending love", emoji: "", color: "bg-green-500 hover:bg-green-600" },
      { text: "You're not alone", emoji: "", color: "bg-green-500 hover:bg-green-600" },
      { text: "Hang in there", emoji: "", color: "bg-green-500 hover:bg-green-600" },
      { text: "We're with you", emoji: "", color: "bg-green-500 hover:bg-green-600" }
    ]
  },
  fun: {
    title: "Fun",
    reactions: [
      { text: "Us bro!", emoji: "🤜", color: "bg-orange-500 hover:bg-orange-600" },
      { text: "Fun", emoji: "🎉", color: "bg-orange-500 hover:bg-orange-600" },
      { text: "Nice", emoji: "👍", color: "bg-orange-500 hover:bg-orange-600" },
      { text: "Haha same", emoji: "😂", color: "bg-orange-500 hover:bg-orange-600" },
      { text: "Mood", emoji: "😌", color: "bg-orange-500 hover:bg-orange-600" },
      { text: "Vibes", emoji: "🎶", color: "bg-orange-500 hover:bg-orange-600" }
    ]
  }
};

export default function WhisperViewer({ whisper, onClose }: WhisperViewerProps) {
  const { markAsViewed, whispers } = useWhispers();
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState<string[]>([]);
  const [showReactions, setShowReactions] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(null);
  
  // Get all unviewed whispers from the same category
  const categoryWhispers = whispers.filter(w => 
    w.category === whisper.category && !w.viewed
  );
  
  const currentWhisper = categoryWhispers[currentIndex] || whisper;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Auto advance or close
          if (currentIndex < categoryWhispers.length - 1) {
            setCurrentIndex(prev => prev + 1);
            return 0;
          } else {
            handleClose();
            return prev;
          }
        }
        return prev + 1;
      });
    }, 50); // 5 second duration (100 * 50ms)

    return () => clearInterval(timer);
  }, [currentIndex, categoryWhispers.length]);

  const handleClose = () => {
    // Mark current whisper as viewed before closing
    markAsViewed(currentWhisper.id);
    onClose();
  };

  const handleNext = () => {
    if (currentIndex < categoryWhispers.length - 1) {
      markAsViewed(currentWhisper.id);
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      setSelectedReactions([]);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      setSelectedReactions([]);
    }
  };

  const handleReaction = (reactionText: string) => {
    // Set animating state
    setAnimatingReaction(reactionText);
    
    // Clear animation after 600ms
    setTimeout(() => {
      setAnimatingReaction(null);
    }, 600);

    setSelectedReactions(prev => 
      prev.includes(reactionText) 
        ? prev.filter(r => r !== reactionText)
        : [...prev, reactionText]
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1">
        {categoryWhispers.map((_, i) => (
          <div key={i} className="flex-1 h-1 bg-white/30 rounded">
            <div 
              className="h-full bg-white rounded transition-all duration-100"
              style={{ 
                width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Top Action buttons - Only Share and Close */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setShowShareModal(true)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <Share size={20} />
        </button>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation areas */}
      <div className="absolute inset-0 flex">
        {/* Left half - previous */}
        <div 
          className="flex-1 cursor-pointer"
          onClick={handlePrevious}
        />
        
        {/* Right half - next */}
        <div 
          className="flex-1 cursor-pointer"
          onClick={handleNext}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md mx-4 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 capitalize">
              {currentWhisper.category}
            </h2>
            <div className="text-sm text-white/70">
              {new Date(currentWhisper.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <p className="text-lg leading-relaxed">
              {currentWhisper.content}
            </p>
          </div>

          {/* Selected Reactions Display with Animation */}
          {selectedReactions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {selectedReactions.map((reaction, index) => (
                <span 
                  key={index}
                  className="bg-white/20 text-white px-3 py-1 rounded-full text-sm animate-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {reaction}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-6 text-sm text-white/50">
            Anonymous whisper • Disappears after viewing
          </div>
        </div>
      </div>

      {/* Bottom Action Bar - Instagram Style */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Reaction button */}
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              showReactions 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">React</span>
          </button>

          {/* Right side - Share button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="text-white/70 hover:text-white transition-colors p-2"
          >
            <Share size={20} />
          </button>
        </div>
      </div>

      {/* Reactions Panel - Fixed at Bottom */}
      {showReactions && (
        <div className="bg-white/10 backdrop-blur-md border-t border-white/20 animate-in slide-in-from-bottom duration-300">
          <div className="px-4 py-3">
            <div className="text-white text-sm font-medium mb-3">React to this whisper</div>
            
            {/* Horizontal scrollable reactions */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              <div className="flex gap-3 pb-2 min-w-max">
                {Object.entries(reactionCategories).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="flex-shrink-0">
                    <div className="text-white/70 text-xs font-medium mb-2">{category.title}</div>
                    <div className="flex gap-2">
                      {category.reactions.map((reaction, index) => {
                        const isSelected = selectedReactions.includes(reaction.text);
                        const isAnimating = animatingReaction === reaction.text;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => handleReaction(reaction.text)}
                            className={`
                              ${reaction.color} text-white px-3 py-2 rounded-full text-sm 
                              flex items-center gap-1 flex-shrink-0 relative overflow-hidden
                              transition-all duration-300 ease-out
                              ${isSelected 
                                ? 'ring-2 ring-white/50 scale-110 shadow-lg' 
                                : 'hover:scale-105 hover:shadow-md'
                              }
                              ${isAnimating ? 'animate-pulse scale-125' : ''}
                            `}
                            style={{
                              transform: isAnimating ? 'scale(1.25) rotate(5deg)' : undefined,
                              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                            }}
                          >
                            {/* Ripple effect */}
                            {isAnimating && (
                              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
                            )}
                            
                            {/* Content */}
                            <span className={`transition-all duration-300 ${isAnimating ? 'scale-110' : ''}`}>
                              {reaction.emoji}
                            </span>
                            <span className={`transition-all duration-300 ${isAnimating ? 'scale-110' : ''}`}>
                              {reaction.text}
                            </span>
                            
                            {/* Selection indicator */}
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-bounce" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation hints */}
      {currentIndex > 0 && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
          <ChevronLeft size={24} />
        </div>
      )}
      
      {currentIndex < categoryWhispers.length - 1 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50">
          <ChevronRight size={24} />
        </div>
      )}

      {/* Share Modal */}
      <ShareWhisperModal
        whisper={currentWhisper}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}