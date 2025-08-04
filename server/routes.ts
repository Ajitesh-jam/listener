import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Whispers API routes
  app.get("/api/whispers", async (req, res) => {
    try {
      const whispers = await storage.getWhispers();
      res.json(whispers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch whispers" });
    }
  });

  app.post("/api/whispers", async (req, res) => {
    try {
      const { content, category } = req.body;
      
      if (!content || !category) {
        return res.status(400).json({ error: "Content and category are required" });
      }

      const whisper = await storage.createWhisper({
        content,
        category,
      });

      res.status(201).json(whisper);
    } catch (error) {
      res.status(500).json({ error: "Failed to create whisper" });
    }
  });

  app.patch("/api/whispers/:id/viewed", async (req, res) => {
    try {
      const { id } = req.params;
      const whisper = await storage.markWhisperAsViewed(id);
      
      if (!whisper) {
        return res.status(404).json({ error: "Whisper not found" });
      }

      res.json(whisper);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark whisper as viewed" });
    }
  });

  // Whisper sharing routes
  app.get("/api/whispers/shared", async (req, res) => {
    try {
      const { userId } = req.query;
      const userIdNumber = userId ? parseInt(userId as string, 10) : undefined;
      const sharedWhispers = await storage.getSharedWhispers(userIdNumber);
      res.json(sharedWhispers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shared whispers" });
    }
  });

  app.post("/api/whispers/:id/share", async (req, res) => {
    try {
      const { id } = req.params;
      const { sharedByUserId, sharedToUserId } = req.body;
      
      if (!sharedByUserId) {
        return res.status(400).json({ error: "sharedByUserId is required" });
      }

      const whisperId = parseInt(id, 10);
      const share = await storage.shareWhisper(whisperId, sharedByUserId, sharedToUserId);
      
      res.status(201).json(share);
    } catch (error) {
      if (error instanceof Error && error.message === "Whisper not found") {
        return res.status(404).json({ error: "Whisper not found" });
      }
      res.status(500).json({ error: "Failed to share whisper" });
    }
  });

  app.get("/api/share/:shareCode", async (req, res) => {
    try {
      const { shareCode } = req.params;
      const whisper = await storage.getWhisperByShareCode(shareCode);
      
      if (!whisper) {
        return res.status(404).json({ error: "Shared whisper not found or expired" });
      }

      res.json(whisper);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shared whisper" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
