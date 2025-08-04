import { useState } from "react";
import WhisperStories from "../components/WhisperStories";
import PlantScene from "../components/PlantScene";
import NavigationBar from "../components/NavigationBar";
import WhisperViewer from "../components/WhisperViewer";
import { useWhispers } from "../lib/stores/useWhispers";

export default function HomePage() {
  const { selectedWhisper, setSelectedWhisper } = useWhispers();

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-green-50 to-amber-50">
      {/* Whisper Stories Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm border-b border-green-100">
        <WhisperStories />
      </div>

      {/* 3D Plant Scene */}
      <div className="absolute inset-0 z-10 pt-20">
        <PlantScene />
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
