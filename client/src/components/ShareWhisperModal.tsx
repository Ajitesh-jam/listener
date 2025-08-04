import { useState } from "react";
import { useWhispers, type Whisper, type WhisperShare } from "../lib/stores/useWhispers";

interface ShareWhisperModalProps {
  whisper: Whisper;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareWhisperModal({ whisper, isOpen, onClose }: ShareWhisperModalProps) {
  const [shareData, setShareData] = useState<WhisperShare | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const shareWhisper = useWhispers(state => state.shareWhisper);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const share = await shareWhisper(whisper.id, 1); // Using user ID 1 for demo
      if (share) {
        setShareData(share);
      }
    } catch (error) {
      console.error('Failed to share whisper:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareLink = () => {
    if (shareData) {
      const shareUrl = `${window.location.origin}/share/${shareData.shareCode}`;
      navigator.clipboard.writeText(shareUrl);
      // Show toast or notification that link was copied
      alert('Share link copied to clipboard!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Share Whisper</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Whisper content:</p>
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-800">
            "{whisper.content}"
          </div>
        </div>

        {!shareData ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Share this whisper anonymously with others. They'll be able to view it once, and the link expires in 7 days.
            </p>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSharing ? 'Creating share link...' : 'Create Share Link'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Share link created!</p>
              <div className="bg-gray-50 p-3 rounded text-xs break-all">
                {window.location.origin}/share/{shareData.shareCode}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyShareLink}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Copy Link
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Link expires on {new Date(shareData.expiresAt || '').toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}