import SharedWhispersSection from "../components/SharedWhispersSection";
import NavigationBar from "../components/NavigationBar";
import WhisperViewer from "../components/WhisperViewer";
import { useWhispers } from "../lib/stores/useWhispers";

export default function SharedWhispersPage() {
  const { selectedWhisper, setSelectedWhisper } = useWhispers();

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm border-b border-blue-100 p-4">
        <h1 className="text-xl font-bold text-gray-900 text-center">Community Whispers</h1>
        <p className="text-sm text-gray-600 text-center mt-1">
          Anonymous stories shared by our community
        </p>
      </div>

      {/* Content */}
      <div className="absolute inset-0 pt-20 pb-20 overflow-y-auto">
        <SharedWhispersSection />
      </div>

      {/* Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <NavigationBar />
      </div>

      {/* Whisper Viewer Modal */}
      {selectedWhisper && (
        <div className="absolute inset-0 z-30">
          <WhisperViewer 
            whisper={selectedWhisper} 
            onClose={() => setSelectedWhisper(null)} 
          />
        </div>
      )}
    </div>
  );
}