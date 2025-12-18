import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { vqeRunRequestSchema, researchNotesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/molecular", async (req, res) => {
    try {
      const data = await storage.getMolecularData();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch molecular data" });
    }
  });

  app.get("/api/quantum-resources", async (req, res) => {
    try {
      const data = await storage.getQuantumResources();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch quantum resources" });
    }
  });

  app.get("/api/fertilizer-metrics", async (req, res) => {
    try {
      const data = await storage.getFertilizerMetrics();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch fertilizer metrics" });
    }
  });

  app.get("/api/vqe-execution", async (req, res) => {
    try {
      const data = await storage.getVQEExecution();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch VQE execution data" });
    }
  });

  app.post("/api/vqe-execution/run", async (req, res) => {
    try {
      const validatedData = vqeRunRequestSchema.parse(req.body);
      await storage.updateVQEStatus("running");
      
      setTimeout(async () => {
        await storage.updateVQEStatus("completed");
      }, 3000);
      
      res.json({ 
        success: true, 
        data: { 
          message: "VQE execution started",
          config: validatedData 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to start VQE execution" });
      }
    }
  });

  app.post("/api/vqe-execution/stop", async (req, res) => {
    try {
      await storage.updateVQEStatus("idle");
      res.json({ success: true, data: { message: "VQE execution stopped" } });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to stop VQE execution" });
    }
  });

  app.get("/api/decision-support", async (req, res) => {
    try {
      const data = await storage.getDecisionSupport();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch decision support data" });
    }
  });

  app.post("/api/decision-support/notes", async (req, res) => {
    try {
      const validatedData = researchNotesSchema.parse(req.body);
      await storage.updateResearchNotes(validatedData.notes);
      res.json({ success: true, data: { message: "Research notes updated" } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to update research notes" });
      }
    }
  });

  return httpServer;
}
