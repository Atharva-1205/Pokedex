import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all pokemon
  app.get("/api/pokemon", async (req: Request, res: Response) => {
    try {
      const pokemon = await storage.getAllPokemon();
      res.json(pokemon);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
      res.status(500).json({ message: "Failed to fetch pokemon data" });
    }
  });

  // Get pokemon by number
  app.get("/api/pokemon/number/:pokedexNumber", async (req: Request, res: Response) => {
    try {
      const { pokedexNumber } = req.params;
      const pokemon = await storage.getPokemonByNumber(pokedexNumber);
      
      if (!pokemon) {
        return res.status(404).json({ message: "Pokemon not found" });
      }
      
      res.json(pokemon);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
      res.status(500).json({ message: "Failed to fetch pokemon data" });
    }
  });

  // Get pokemon by name
  app.get("/api/pokemon/name/:name", async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      const pokemon = await storage.getPokemonByName(name);
      
      if (!pokemon) {
        return res.status(404).json({ message: "Pokemon not found" });
      }
      
      res.json(pokemon);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
      res.status(500).json({ message: "Failed to fetch pokemon data" });
    }
  });

  // Get all moves
  app.get("/api/moves", async (req: Request, res: Response) => {
    try {
      const moves = await storage.getAllMoves();
      res.json(moves);
    } catch (error) {
      console.error("Error fetching moves:", error);
      res.status(500).json({ message: "Failed to fetch moves data" });
    }
  });

  // Get move by name
  app.get("/api/moves/:name", async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      const move = await storage.getMoveByName(name);
      
      if (!move) {
        return res.status(404).json({ message: "Move not found" });
      }
      
      res.json(move);
    } catch (error) {
      console.error("Error fetching move:", error);
      res.status(500).json({ message: "Failed to fetch move data" });
    }
  });

  // Get all natures
  app.get("/api/natures", async (req: Request, res: Response) => {
    try {
      const natures = await storage.getAllNatures();
      res.json(natures);
    } catch (error) {
      console.error("Error fetching natures:", error);
      res.status(500).json({ message: "Failed to fetch natures data" });
    }
  });

  // Get regional variants
  app.get("/api/variants", async (req: Request, res: Response) => {
    try {
      const variants = await storage.getRegionalVariants();
      res.json(variants);
    } catch (error) {
      console.error("Error fetching variants:", error);
      res.status(500).json({ message: "Failed to fetch variants data" });
    }
  });

  // User favorites
  app.post("/api/favorites", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        userId: z.number(),
        favorites: z.array(z.string())
      });
      
      const { userId, favorites } = schema.parse(req.body);
      const updatedUser = await storage.updateUserFavorites(userId, favorites);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ favorites: updatedUser.favorites });
    } catch (error) {
      console.error("Error updating favorites:", error);
      res.status(500).json({ message: "Failed to update favorites" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
