import { type Url, type InsertUrl, type Click } from "@shared/schema";
import { randomUUID } from "crypto";
import { nanoid } from "nanoid";

export interface IStorage {
  // URL operations
  createUrl(url: InsertUrl): Promise<Url>;
  getUrlByCode(code: string): Promise<Url | undefined>;
  getAllUrls(): Promise<Url[]>;
  deleteUrl(code: string): Promise<boolean>;
  incrementClicks(code: string): Promise<void>;
  
  // Click tracking
  recordClick(urlId: string): Promise<void>;
  getClicksByUrlId(urlId: string): Promise<Click[]>;
  
  // Statistics
  getTotalUrls(): Promise<number>;
  getTotalClicks(): Promise<number>;
  getActiveUrls(): Promise<number>;
}

export class MemStorage implements IStorage {
  private urls: Map<string, Url>;
  private clicks: Map<string, Click>;

  constructor() {
    this.urls = new Map();
    this.clicks = new Map();
  }

  async createUrl(insertUrl: InsertUrl): Promise<Url> {
    const id = randomUUID();
    const code = insertUrl.code || nanoid(8);
    
    // Check if code already exists
    const existing = Array.from(this.urls.values()).find(u => u.code === code);
    if (existing) {
      throw new Error("Short code already exists");
    }

    const now = new Date();
    let expiresAt: Date | null = null;

    if (insertUrl.expiresAt) {
      const expiresIn = insertUrl.expiresAt;
      if (expiresIn !== "never") {
        if (expiresIn === "1h") expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
        else if (expiresIn === "24h") expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        else if (expiresIn === "7d") expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        else if (expiresIn === "30d") expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        else if (expiresIn === "1y") expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      }
    }

    const url: Url = {
      id,
      code,
      originalUrl: insertUrl.originalUrl,
      clicks: 0,
      createdAt: now,
      expiresAt,
    };

    this.urls.set(id, url);
    return url;
  }

  async getUrlByCode(code: string): Promise<Url | undefined> {
    const url = Array.from(this.urls.values()).find(u => u.code === code);
    
    if (url && url.expiresAt) {
      if (new Date() > url.expiresAt) {
        return undefined; // URL has expired
      }
    }
    
    return url;
  }

  async getAllUrls(): Promise<Url[]> {
    return Array.from(this.urls.values())
      .filter(url => !url.expiresAt || new Date() <= url.expiresAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteUrl(code: string): Promise<boolean> {
    const url = await this.getUrlByCode(code);
    if (!url) return false;
    
    // Delete all clicks associated with this URL
    const clicksToDelete = Array.from(this.clicks.entries())
      .filter(([_, click]) => click.urlId === url.id)
      .map(([id]) => id);
    
    clicksToDelete.forEach(id => this.clicks.delete(id));
    
    this.urls.delete(url.id);
    return true;
  }

  async incrementClicks(code: string): Promise<void> {
    const url = await this.getUrlByCode(code);
    if (url) {
      url.clicks += 1;
      this.urls.set(url.id, url);
    }
  }

  async recordClick(urlId: string): Promise<void> {
    const click: Click = {
      id: randomUUID(),
      urlId,
      timestamp: new Date(),
    };
    this.clicks.set(click.id, click);
  }

  async getClicksByUrlId(urlId: string): Promise<Click[]> {
    return Array.from(this.clicks.values())
      .filter(click => click.urlId === urlId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getTotalUrls(): Promise<number> {
    return this.urls.size;
  }

  async getTotalClicks(): Promise<number> {
    return this.clicks.size;
  }

  async getActiveUrls(): Promise<number> {
    const now = new Date();
    return Array.from(this.urls.values())
      .filter(url => !url.expiresAt || url.expiresAt > now)
      .length;
  }
}

export const storage = new MemStorage();
