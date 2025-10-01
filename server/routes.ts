import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUrlSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create shortened URL
  app.post("/api/shorturl", async (req, res) => {
    try {
      const result = insertUrlSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Invalid request", 
          message: validationError.message 
        });
      }

      const url = await storage.createUrl(result.data);
      
      // Get base URL from environment or request
      const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
      const baseUrl = domains[0] 
        ? `https://${domains[0]}` 
        : `${req.protocol}://${req.get('host')}`;
      
      return res.status(201).json({
        original_url: url.originalUrl,
        short_url: `${baseUrl}/${url.code}`,
        code: url.code,
        created_at: url.createdAt,
      });
    } catch (error: any) {
      if (error.message === "Short code already exists") {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get URL statistics
  app.get("/api/shorturl/:code/stats", async (req, res) => {
    try {
      const { code } = req.params;
      const url = await storage.getUrlByCode(code);
      
      if (!url) {
        return res.status(404).json({ error: "URL not found" });
      }

      const recentClicks = await storage.getClicksByUrlId(url.id);
      
      return res.json({
        code: url.code,
        originalUrl: url.originalUrl,
        totalClicks: url.clicks,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        recentClicks: recentClicks.slice(0, 10).map(click => ({
          timestamp: click.timestamp,
        })),
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all URLs
  app.get("/api/shorturl", async (req, res) => {
    try {
      const urls = await storage.getAllUrls();
      
      const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
      const baseUrl = domains[0] 
        ? `https://${domains[0]}` 
        : `${req.protocol}://${req.get('host')}`;
      
      return res.json(urls.map(url => ({
        code: url.code,
        originalUrl: url.originalUrl,
        shortUrl: `${baseUrl}/${url.code}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
      })));
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete shortened URL
  app.delete("/api/shorturl/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const deleted = await storage.deleteUrl(code);
      
      if (!deleted) {
        return res.status(404).json({ error: "URL not found" });
      }

      return res.json({ 
        message: "URL deleted successfully",
        code 
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get statistics overview
  app.get("/api/stats", async (req, res) => {
    try {
      const totalUrls = await storage.getTotalUrls();
      const totalClicks = await storage.getTotalClicks();
      const activeUrls = await storage.getActiveUrls();
      const avgClickRate = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : "0.0";

      return res.json({
        totalUrls,
        totalClicks,
        activeUrls,
        avgClickRate,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Redirect shortened URL - must be registered AFTER API routes but BEFORE Vite
  app.get("/:code", async (req, res, next) => {
    try {
      const { code } = req.params;
      
      // Skip if it's an API route, static asset, or special path
      if (code.startsWith('api') || 
          code.includes('.') || 
          code === 'src' || 
          code === '@vite' || 
          code === '@fs' ||
          code === 'node_modules') {
        return next();
      }

      const url = await storage.getUrlByCode(code);
      
      if (!url) {
        // Let Vite handle 404s for non-existent short codes
        return next();
      }

      // Record click and increment counter
      await storage.incrementClicks(code);
      await storage.recordClick(url.id);

      return res.redirect(302, url.originalUrl);
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
