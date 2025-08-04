import { users, whispers, whisperShares, type User, type InsertUser, type Whisper, type InsertWhisper, type WhisperShare, type InsertWhisperShare } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getWhispers(): Promise<Whisper[]>;
  getSharedWhispers(userId?: number): Promise<Whisper[]>;
  createWhisper(whisper: InsertWhisper): Promise<Whisper>;
  markWhisperAsViewed(id: string): Promise<Whisper | undefined>;
  shareWhisper(whisperId: number, sharedByUserId: number, sharedToUserId?: number): Promise<WhisperShare>;
  getWhisperByShareCode(shareCode: string): Promise<Whisper | undefined>;
  generateShareCode(): string;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private whispers: Map<number, Whisper>;
  private whisperShares: Map<number, WhisperShare>;
  currentUserId: number;
  currentWhisperId: number;
  currentShareId: number;

  constructor() {
    this.users = new Map();
    this.whispers = new Map();
    this.whisperShares = new Map();
    this.currentUserId = 1;
    this.currentWhisperId = 1;
    this.currentShareId = 1;
    
    // Add some sample whispers
    this.addSampleWhispers();
  }

  private addSampleWhispers() {
    const sampleWhispers = [
      {
        content: "Sometimes I wonder if I'm good enough for the dreams I chase...",
        category: "thoughts",
        viewed: false,
        authorId: null
      },
      {
        content: "I wish I had told them how much they meant to me before it was too late.",
        category: "regrets", 
        viewed: false,
        authorId: null
      },
      {
        content: "Why does everything feel so overwhelming today? I just want to disappear.",
        category: "frustration",
        viewed: false,
        authorId: null
      },
      {
        content: "Remember when we used to watch the sunset from that old bridge? Those were simpler times.",
        category: "memories",
        viewed: false,
        authorId: null
      },
      {
        content: "I've been struggling with anxiety lately and I don't know who to talk to about it.",
        category: "open",
        viewed: false,
        authorId: null
      }
    ];

    for (const whisperData of sampleWhispers) {
      const id = this.currentWhisperId++;
      const whisper: Whisper = {
        id,
        ...whisperData,
        createdAt: new Date(),
        isShared: false,
        sharedAt: null,
        originalAuthorId: null
      };
      this.whispers.set(id, whisper);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWhispers(): Promise<Whisper[]> {
    return Array.from(this.whispers.values());
  }

  async createWhisper(insertWhisper: InsertWhisper): Promise<Whisper> {
    const id = this.currentWhisperId++;
    const whisper: Whisper = {
      id,
      ...insertWhisper,
      createdAt: new Date(),
      viewed: false,
      authorId: null,
      isShared: false,
      sharedAt: null,
      originalAuthorId: null
    };
    this.whispers.set(id, whisper);
    return whisper;
  }

  async markWhisperAsViewed(id: string): Promise<Whisper | undefined> {
    const whisperId = parseInt(id, 10);
    const whisper = this.whispers.get(whisperId);
    if (whisper) {
      const updatedWhisper = { ...whisper, viewed: true };
      this.whispers.set(whisperId, updatedWhisper);
      return updatedWhisper;
    }
    return undefined;
  }

  async getSharedWhispers(userId?: number): Promise<Whisper[]> {
    const allWhispers = Array.from(this.whispers.values());
    return allWhispers.filter(whisper => whisper.isShared);
  }

  async shareWhisper(whisperId: number, sharedByUserId: number, sharedToUserId?: number): Promise<WhisperShare> {
    const whisper = this.whispers.get(whisperId);
    if (!whisper) {
      throw new Error("Whisper not found");
    }

    // Mark whisper as shared
    const updatedWhisper = { 
      ...whisper, 
      isShared: true, 
      sharedAt: new Date(),
      originalAuthorId: whisper.authorId 
    };
    this.whispers.set(whisperId, updatedWhisper);

    // Create share record
    const shareId = this.currentShareId++;
    const shareCode = this.generateShareCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    const share: WhisperShare = {
      id: shareId,
      whisperId,
      sharedByUserId,
      sharedToUserId: sharedToUserId || null,
      shareCode,
      expiresAt,
      createdAt: new Date()
    };

    this.whisperShares.set(shareId, share);
    return share;
  }

  async getWhisperByShareCode(shareCode: string): Promise<Whisper | undefined> {
    const share = Array.from(this.whisperShares.values()).find(
      share => share.shareCode === shareCode && 
                (!share.expiresAt || share.expiresAt > new Date())
    );
    
    if (share) {
      return this.whispers.get(share.whisperId);
    }
    return undefined;
  }

  generateShareCode(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export const storage = new MemStorage();
