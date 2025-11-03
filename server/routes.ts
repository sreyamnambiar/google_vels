import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertPlaceSchema,
  insertMarketplaceItemSchema,
  insertCommunityPostSchema,
  insertEducationModuleSchema,
  insertNGOSchema,
  insertCrowdfundingCampaignSchema,
  insertChatMessageSchema,
} from "@shared/schema";
import { chatWithAI, processVoiceCommand, generateMarketplaceDescription, analyzeAccessibilityFromImage, analyzeImageWithVision, processAudioWithGemini, analyzeDocumentWithGemini, processRealtimeChat } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== AI CHAT ROUTES =====
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId, conversationHistory, userLocation, isLocationQuery } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get AI response with location context
      const aiResponse = await chatWithAI(message, conversationHistory, userLocation, isLocationQuery);

      // Handle both string and object responses
      const responseText = typeof aiResponse === 'string' ? aiResponse : aiResponse.response;
      const mapData = typeof aiResponse === 'object' && aiResponse.mapData ? aiResponse.mapData : null;

      // Store messages
      await storage.createChatMessage({
        role: "user",
        content: message,
        sessionId: sessionId || null,
      });

      const assistantMessage = await storage.createChatMessage({
        role: "assistant",
        content: responseText,
        sessionId: sessionId || null,
      });

      res.json({
        response: responseText,
        mapData: mapData,
        message: assistantMessage,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== VOICE COMMAND ROUTE =====
  app.post("/api/voice/process", async (req, res) => {
    try {
      const { transcript } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: "Transcript is required" });
      }

      const result = await processVoiceCommand(transcript);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== PLACES ROUTES =====
  app.get("/api/places", async (req, res) => {
    try {
      const { type, features } = req.query;
      const filters: any = {};

      if (type) filters.type = type as string;
      if (features) {
        filters.features = Array.isArray(features) ? features : [features];
      }

      const places = await storage.getPlaces(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(places);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/places/:id", async (req, res) => {
    try {
      const place = await storage.getPlace(req.params.id);
      if (!place) {
        return res.status(404).json({ error: "Place not found" });
      }
      res.json(place);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/places", async (req, res) => {
    try {
      const validatedData = insertPlaceSchema.parse(req.body);
      const place = await storage.createPlace(validatedData);
      res.status(201).json(place);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/places/analyze-image", async (req, res) => {
    try {
      const { imageBase64 } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "Image data is required" });
      }

      const analysis = await analyzeAccessibilityFromImage(imageBase64);
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== MARKETPLACE ROUTES =====
  app.get("/api/marketplace", async (req, res) => {
    try {
      const items = await storage.getMarketplaceItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/marketplace/:id", async (req, res) => {
    try {
      const item = await storage.getMarketplaceItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/marketplace", async (req, res) => {
    try {
      const validatedData = insertMarketplaceItemSchema.parse(req.body);
      const item = await storage.createMarketplaceItem(validatedData);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/marketplace/generate-description", async (req, res) => {
    try {
      const { title, imageAnalysis } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const result = await generateMarketplaceDescription(title, imageAnalysis);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== COMMUNITY POSTS ROUTES =====
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getCommunityPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(validatedData);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      const post = await storage.likePost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== EDUCATION ROUTES =====
  app.get("/api/education", async (req, res) => {
    try {
      const modules = await storage.getEducationModules();
      res.json(modules);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/education/:id", async (req, res) => {
    try {
      const module = await storage.getEducationModule(req.params.id);
      if (!module) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.json(module);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/education", async (req, res) => {
    try {
      const validatedData = insertEducationModuleSchema.parse(req.body);
      const module = await storage.createEducationModule(validatedData);
      res.status(201).json(module);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ===== NGO ROUTES =====
  app.get("/api/ngos", async (req, res) => {
    try {
      const ngos = await storage.getNGOs();
      res.json(ngos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/ngos/:id", async (req, res) => {
    try {
      const ngo = await storage.getNGO(req.params.id);
      if (!ngo) {
        return res.status(404).json({ error: "NGO not found" });
      }
      res.json(ngo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ngos", async (req, res) => {
    try {
      const validatedData = insertNGOSchema.parse(req.body);
      const ngo = await storage.createNGO(validatedData);
      res.status(201).json(ngo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ===== CROWDFUNDING ROUTES =====
  app.get("/api/crowdfunding", async (req, res) => {
    try {
      const campaigns = await storage.getCrowdfundingCampaigns();
      res.json(campaigns);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/crowdfunding/:id", async (req, res) => {
    try {
      const campaign = await storage.getCrowdfundingCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/crowdfunding", async (req, res) => {
    try {
      const validatedData = insertCrowdfundingCampaignSchema.parse(req.body);
      const campaign = await storage.createCrowdfundingCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/crowdfunding/:id/donate", async (req, res) => {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid donation amount is required" });
      }

      const campaign = await storage.donateToCampaign(req.params.id, amount);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== VISION ANALYSIS ROUTE =====
  app.post("/api/vision-analyze", async (req, res) => {
    try {
      const { image, analysisType = 'accessibility_safety' } = req.body;

      if (!image) {
        return res.status(400).json({ error: "Image is required" });
      }

      const analysis = await analyzeImageWithVision(image, analysisType);
      res.json({ analysis });
    } catch (error: any) {
      console.error("Vision analysis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ===== SPEECH ANALYSIS ROUTE =====
  app.post("/api/speech-analyze", async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const audioFile = files?.find(f => f.fieldname === 'audio');
      const language = req.body.language || 'en-US';

      if (!audioFile) {
        return res.status(400).json({ error: "Audio file is required" });
      }

      const result = await processAudioWithGemini(audioFile, language);
      res.json({ result });
    } catch (error: any) {
      console.error("Speech analysis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ===== DOCUMENT ANALYSIS ROUTE =====
  app.post("/api/document-analyze", async (req, res) => {
    try {
      const { documentUrl, analysisType = 'accessibility_summary' } = req.body;

      if (!documentUrl) {
        return res.status(400).json({ error: "Document URL is required" });
      }

      const analysis = await analyzeDocumentWithGemini(documentUrl, analysisType);
      res.json({ analysis });
    } catch (error: any) {
      console.error("Document analysis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ===== REAL-TIME CHAT ROUTE =====
  app.post("/api/realtime-chat", async (req, res) => {
    try {
      const { message, context, userId, roomId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await processRealtimeChat(message, context, userId, roomId);
      res.json({ response });
    } catch (error: any) {
      console.error("Realtime chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
