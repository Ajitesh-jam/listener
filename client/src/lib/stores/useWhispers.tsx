import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type WhisperCategory = "frustration" | "regrets" | "thoughts" | "memories" | "open";

export interface Whisper {
  id: number;
  content: string;
  category: WhisperCategory;
  createdAt: string;
  viewed: boolean;
  authorId?: number | null;
  isShared?: boolean;
  sharedAt?: string | null;
  originalAuthorId?: number | null;
}

export interface WhisperShare {
  id: number;
  whisperId: number;
  sharedByUserId: number;
  sharedToUserId?: number | null;
  shareCode: string;
  expiresAt?: string;
  createdAt: string;
}

interface WhisperState {
  whispers: Whisper[];
  sharedWhispers: Whisper[];
  selectedWhisper: Whisper | null;
  
  // Actions
  setWhispers: (whispers: Whisper[]) => void;
  setSharedWhispers: (whispers: Whisper[]) => void;
  addWhisper: (whisper: Omit<Whisper, "id" | "createdAt" | "viewed" | "isShared" | "sharedAt" | "originalAuthorId">) => void;
  setSelectedWhisper: (whisper: Whisper | null) => void;
  markAsViewed: (id: number) => void;
  shareWhisper: (whisperId: number, sharedByUserId: number) => Promise<WhisperShare | null>;
  fetchSharedWhisperByCode: (shareCode: string) => Promise<Whisper | null>;
  fetchWhispers: () => Promise<void>;
  fetchSharedWhispers: () => Promise<void>;
}

export const useWhispers = create<WhisperState>()(
  subscribeWithSelector((set, get) => ({
    whispers: [],
    sharedWhispers: [],
    selectedWhisper: null,
    
    setWhispers: (whispers) => set({ whispers }),
    setSharedWhispers: (sharedWhispers) => set({ sharedWhispers }),
    
    addWhisper: async (whisperData) => {
      try {
        const response = await fetch('/api/whispers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(whisperData),
        });
        
        if (response.ok) {
          const newWhisper = await response.json();
          set((state) => ({
            whispers: [...state.whispers, newWhisper]
          }));
        }
      } catch (error) {
        console.error('Failed to create whisper:', error);
      }
    },
    
    setSelectedWhisper: (whisper) => set({ selectedWhisper: whisper }),
    
    markAsViewed: async (id) => {
      try {
        const response = await fetch(`/api/whispers/${id}/viewed`, {
          method: 'PATCH',
        });
        
        if (response.ok) {
          set((state) => ({
            whispers: state.whispers.map(w => 
              w.id === id ? { ...w, viewed: true } : w
            )
          }));
        }
      } catch (error) {
        console.error('Failed to mark whisper as viewed:', error);
      }
    },
    
    shareWhisper: async (whisperId, sharedByUserId) => {
      try {
        const response = await fetch(`/api/whispers/${whisperId}/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sharedByUserId }),
        });
        
        if (response.ok) {
          const share = await response.json();
          // Refresh whispers to get updated sharing status
          get().fetchWhispers();
          get().fetchSharedWhispers();
          return share;
        }
      } catch (error) {
        console.error('Failed to share whisper:', error);
      }
      return null;
    },
    
    fetchSharedWhisperByCode: async (shareCode) => {
      try {
        const response = await fetch(`/api/share/${shareCode}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error('Failed to fetch shared whisper:', error);
      }
      return null;
    },
    
    fetchSharedWhispers: async () => {
      try {
        const response = await fetch('/api/whispers/shared');
        if (response.ok) {
          const sharedWhispers = await response.json();
          set({ sharedWhispers });
        }
      } catch (error) {
        console.error('Failed to fetch shared whispers:', error);
      }
    },
    
    fetchWhispers: async () => {
      try {
        const response = await fetch('/api/whispers');
        if (response.ok) {
          const whispers = await response.json();
          set({ whispers });
        }
      } catch (error) {
        console.error('Failed to fetch whispers:', error);
        
        // Add some sample whispers for demo
        const sampleWhispers: Whisper[] = [
          {
            id: 1,
            content: "Sometimes I wonder if I'm good enough for the dreams I chase...",
            category: "thoughts",
            createdAt: new Date().toISOString(),
            viewed: false,
            isShared: false
          },
          {
            id: 2, 
            content: "I wish I had told them how much they meant to me before it was too late.",
            category: "regrets",
            createdAt: new Date().toISOString(),
            viewed: false,
            isShared: false
          },
          {
            id: 3,
            content: "Why does everything feel so overwhelming today? I just want to disappear.",
            category: "frustration",
            createdAt: new Date().toISOString(),
            viewed: false,
            isShared: false
          },
          {
            id: 4,
            content: "Remember when we used to watch the sunset from that old bridge? Those were simpler times.",
            category: "memories",
            createdAt: new Date().toISOString(),
            viewed: false,
            isShared: false
          },
          {
            id: 5,
            content: "I've been struggling with anxiety lately and I don't know who to talk to about it.",
            category: "open",
            createdAt: new Date().toISOString(),
            viewed: false,
            isShared: false
          }
        ];
        
        set({ whispers: sampleWhispers });
      }
    }
  }))
);

// Auto-fetch whispers on store initialization
useWhispers.getState().fetchWhispers();
