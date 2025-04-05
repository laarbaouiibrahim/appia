import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { json } from "express";
import { insertServerSchema, insertCampaignSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware
  app.use(json());
  
  // Root route
  app.get('/api', (req, res) => {
    res.json({ 
      message: 'Welcome to EmailMarketer API',
      version: '1.0.0',
      endpoints: [
        '/api/servers',
        '/api/campaigns'
      ]
    });
  });
  
  // API Routes for Servers
  app.get('/api/servers', async (req, res) => {
    try {
      const servers = await storage.getServers();
      res.json(servers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch servers' });
    }
  });
  
  app.get('/api/servers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const server = await storage.getServer(id);
      
      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }
      
      res.json(server);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch server' });
    }
  });
  
  app.post('/api/servers', async (req, res) => {
    try {
      const result = insertServerSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ error: errorMessage });
      }
      
      const server = await storage.createServer(result.data);
      res.status(201).json(server);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create server' });
    }
  });
  
  app.patch('/api/servers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const server = await storage.getServer(id);
      
      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }
      
      const updatedServer = await storage.updateServer(id, req.body);
      res.json(updatedServer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update server' });
    }
  });
  
  app.delete('/api/servers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const server = await storage.getServer(id);
      
      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }
      
      const deleted = await storage.deleteServer(id);
      
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).json({ error: 'Failed to delete server' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete server' });
    }
  });
  
  // Test endpoint
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });

  // API Routes for Campaigns
  app.get('/api/campaigns', async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
  });
  
  app.get('/api/campaigns/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch campaign' });
    }
  });
  
  app.post('/api/campaigns', async (req, res) => {
    try {
      const result = insertCampaignSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ error: errorMessage });
      }
      
      const campaign = await storage.createCampaign(result.data);
      res.status(201).json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  });
  
  app.patch('/api/campaigns/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      
      const updatedCampaign = await storage.updateCampaign(id, req.body);
      res.json(updatedCampaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update campaign' });
    }
  });
  
  app.delete('/api/campaigns/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      
      const deleted = await storage.deleteCampaign(id);
      
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).json({ error: 'Failed to delete campaign' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete campaign' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
