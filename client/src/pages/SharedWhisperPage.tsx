import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useWhispers, type Whisper } from "../lib/stores/useWhispers";
import { ArrowLeft, Share2 } from "lucide-react";

export default function SharedWhisperPage() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [whisper, setWhisper] = useState<Whisper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchSharedWhisperByCode = useWhispers(state => state.fetchSharedWhisperByCode);

  useEffect(() => {
    const loadSharedWhisper = async () => {
      if (!shareCode) {
        setError("No share code provided");
        setLoading(false);
        return;
      }

      try {
        const sharedWhisper = await fetchSharedWhisperByCode(shareCode);
        if (sharedWhisper) {
          setWhisper(sharedWhisper);
        } else {
          setError("Shared whisper not found or has expired");
        }
      } catch (err) {
        setError("Failed to load shared whisper");
      } finally {
        setLoading(false);
      }
    };

    loadSharedWhisper();
  }, [shareCode, fetchSharedWhisperByCode]);

  const getCategoryColor = (category: string) => {
    const colors = {
      frustration: "from-red-600 to-orange-600",
      regrets: "from-blue-600 to-indigo-600",
      thoughts: "from-yellow-500 to-orange-500",
      memories: "from-orange-600 to-red-600",
      open: "from-purple-600 to-pink-600"
    };
    return colors[category as keyof typeof colors] || "from-gray-600 to-gray-700";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      frustration: "⚡",
      regrets: "💧",
      thoughts: "☀️",
      memories: "🍂",
      open: "🌅"
    };
    return icons[category as keyof typeof icons] || "💭";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading shared whisper...</p>
        </div>
      </div>
    );
  }

  if (error || !whisper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-white text-center max-w-md mx-4">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-4">Whisper Not Found</h1>
          <p className="text-white/70 mb-6">
            {error || "This shared whisper might have expired or been removed."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getCategoryColor(whisper.category)} flex items-center justify-center`}>
      <div className="max-w-2xl mx-4 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="text-6xl mb-4">{getCategoryIcon(whisper.category)}</div>
          <h1 className="text-3xl font-bold text-white mb-2 capitalize">
            {whisper.category}
          </h1>
          <p className="text-white/70">
            Shared anonymously • {new Date(whisper.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Whisper Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <Share2 size={24} className="text-white/60" />
          </div>
          <p className="text-xl leading-relaxed">
            "{whisper.content}"
          </p>
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <p className="text-white/60 text-sm">
            This whisper was shared with you anonymously. 
            It's a glimpse into someone's inner thoughts and feelings.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={20} />
              Explore More Whispers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}