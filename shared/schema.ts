import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  favorites: text("favorites").array(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const pokemonSchema = z.object({
  id: z.number(),
  pokedexNumber: z.string(),
  name: z.string(),
  primaryType: z.string(),
  secondaryType: z.string().optional(),
  hp: z.string(),
  attack: z.string(),
  defense: z.string(),
  specialAttack: z.string(),
  specialDefense: z.string(),
  speed: z.string(),
  total: z.string(),
  physicalSweeper: z.string(),
  specialSweeper: z.string(),
  wall: z.string(),
  physicalTank: z.string(),
  specialTank: z.string(),
  species: z.string(),
  height: z.string(),
  weight: z.string(),
  abilityI: z.string(),
  abilityII: z.string().optional(),
  hiddenAbility: z.string().optional(),
  evYield: z.string(),
  baseExp: z.string(),
  eggGroupI: z.string(),
  eggGroupII: z.string().optional(),
  gender: z.string(),
  generation: z.string(),
  rarity: z.string().optional(),
  normalSprite: z.string(),
  shinySprite: z.string(),
  isVariant: z.boolean().default(false),
  variantType: z.string().optional(),
  isFavorite: z.boolean().default(false),
});

export const moveSchema = z.object({
  name: z.string(),
  type: z.string(),
  category: z.string(),
  power: z.string(),
  accuracy: z.string(),
  pp: z.string(),
  effect: z.string(),
  probability: z.string(),
});

export const natureSchema = z.object({
  nature: z.string(),
  increases: z.string(),
  decreases: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Pokemon = z.infer<typeof pokemonSchema>;
export type Move = z.infer<typeof moveSchema>;
export type Nature = z.infer<typeof natureSchema>;
