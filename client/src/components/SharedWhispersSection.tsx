import { useEffect } from "react";
import { useWhispers } from "../lib/stores/useWhispers";
import { Share2, Calendar, Eye } from "lucide-react";

export default function SharedWhispersSection() {
  const { sharedWhispers, fetchSharedWhispers, setSelectedWhisper } = useWhispers();

  useEffect(() => {
    fetchSharedWhispers();
  }, [fetchSharedWhispers]);

  const getCategoryColor = (category: string) => {
    const colors = {
      frustration: "bg-red-100 text-red-800 border-red-200",
      regrets: "bg-blue-100 text-blue-800 border-blue-200",
      thoughts: "bg-yellow-100 text-yellow-800 border-yellow-200",
      memories: "bg-orange-100 text-orange-800 border-orange-200",
      open: "bg-purple-100 text-purple-800 border-purple-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
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

  if (sharedWhispers.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">🤝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Shared Whispers Yet</h3>
        <p className="text-gray-600 mb-4">
          When users share their whispers, they'll appear here for everyone to discover anonymously.
        </p>
        <div className="text-sm text-gray-500">
          Shared whispers help create connections through shared experiences and emotions.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Share2 size={20} />
          Shared Whispers
        </h3>
        <p className="text-sm text-gray-600">
          Anonymous whispers shared by the community. Each can only be viewed once.
        </p>
      </div>

      <div className="space-y-3">
        {sharedWhispers.map((whisper) => (
          <div
            key={whisper.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedWhisper(whisper)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCategoryIcon(whisper.category)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(whisper.category)}`}>
                  {whisper.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={12} />
                {new Date(whisper.sharedAt || whisper.createdAt).toLocaleDateString()}
              </div>
            </div>

            <p className="text-gray-800 mb-3 line-clamp-2">
              {whisper.content}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Share2 size={12} />
                Shared anonymously
              </div>
              {!whisper.viewed && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Eye size={12} />
                  Unviewed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-blue-500">
            <Share2 size={16} />
          </div>
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">How Sharing Works</p>
            <p className="text-blue-800">
              When you share a whisper, it becomes available to the community while remaining completely anonymous. 
              Shared whispers disappear after being viewed once, creating ephemeral connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}