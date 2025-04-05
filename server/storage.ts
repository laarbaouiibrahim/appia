import { servers, type Server, type InsertServer, campaigns, type Campaign, type InsertCampaign, users, type User, type InsertUser } from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Server operations
  getServers(): Promise<Server[]>;
  getServer(id: number): Promise<Server | undefined>;
  createServer(server: InsertServer): Promise<Server>;
  updateServer(id: number, server: Partial<Server>): Promise<Server | undefined>;
  deleteServer(id: number): Promise<boolean>;
  
  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private servers: Map<number, Server>;
  private campaigns: Map<number, Campaign>;
  
  private currentUserId: number;
  private currentServerId: number;
  private currentCampaignId: number;

  constructor() {
    this.users = new Map();
    this.servers = new Map();
    this.campaigns = new Map();
    
    this.currentUserId = 1;
    this.currentServerId = 1;
    this.currentCampaignId = 1;
    
    // Add sample servers for testing
    this.createServer({
      name: "mail-01.example.com",
      ip: "192.168.1.10",
      username: "admin",
      password: "password",
      serverType: "PowerMTA"
    });
    
    this.createServer({
      name: "mail-02.example.com",
      ip: "192.168.1.11",
      username: "admin",
      password: "password",
      serverType: "PowerMTA"
    });
  }

  // User methods
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
  
  // Server methods
  async getServers(): Promise<Server[]> {
    return Array.from(this.servers.values());
  }
  
  async getServer(id: number): Promise<Server | undefined> {
    return this.servers.get(id);
  }
  
  async createServer(insertServer: InsertServer): Promise<Server> {
    const id = this.currentServerId++;
    const currentTime = new Date();
    const server: Server = { 
      ...insertServer, 
      id, 
      status: "active", 
      performanceRating: Math.floor(Math.random() * 100), 
      createdAt: currentTime 
    };
    this.servers.set(id, server);
    return server;
  }
  
  async updateServer(id: number, serverUpdate: Partial<Server>): Promise<Server | undefined> {
    const server = this.servers.get(id);
    if (!server) return undefined;
    
    const updatedServer = { ...server, ...serverUpdate };
    this.servers.set(id, updatedServer);
    return updatedServer;
  }
  
  async deleteServer(id: number): Promise<boolean> {
    return this.servers.delete(id);
  }
  
  // Campaign methods
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }
  
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }
  
  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const currentTime = new Date();
    const campaign: Campaign = { ...insertCampaign, id, createdAt: currentTime };
    this.campaigns.set(id, campaign);
    return campaign;
  }
  
  async updateCampaign(id: number, campaignUpdate: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...campaignUpdate };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
  
  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }
}

export const storage = new MemStorage();
