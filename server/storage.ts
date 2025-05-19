import { users, type User, type InsertUser, type Pokemon, type Move, type Nature } from "@shared/schema";
import fs from "fs";
import path from "path";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserFavorites(userId: number, favorites: string[]): Promise<User | undefined>;
  getAllPokemon(): Promise<Pokemon[]>;
  getPokemonByNumber(pokedexNumber: string): Promise<Pokemon | undefined>;
  getPokemonByName(name: string): Promise<Pokemon | undefined>;
  getAllMoves(): Promise<Move[]>;
  getMoveByName(name: string): Promise<Move | undefined>;
  getAllNatures(): Promise<Nature[]>;
  getRegionalVariants(): Promise<Pokemon[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pokemon: Pokemon[];
  private moves: Move[];
  private natures: Nature[];
  private regionalVariants: Pokemon[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Load Pokemon data
    const nationalDexPath = path.resolve(process.cwd(), "attached_assets/National Dex.json");
    const nationalDexData = JSON.parse(fs.readFileSync(nationalDexPath, "utf-8"));
    this.pokemon = nationalDexData.map((pokemon: any, index: number) => ({
      id: index + 1,
      pokedexNumber: pokemon["Pokedex Number"],
      name: pokemon["Name"],
      primaryType: pokemon["Primary Type"],
      secondaryType: pokemon["Secondary Type"] || "",
      hp: pokemon["HP"],
      attack: pokemon["Attack"],
      defense: pokemon["Defense"],
      specialAttack: pokemon["Special Attack"],
      specialDefense: pokemon["Special Defense"],
      speed: pokemon["Speed"],
      total: pokemon["Total"],
      physicalSweeper: pokemon["Physical Sweeper(Attack + Speed)"],
      specialSweeper: pokemon["Special Sweeper(Special Attack + Speed)"],
      wall: pokemon["Wall(HP + Defense + Special Defense)"],
      physicalTank: pokemon["Physical Tank(Attack + Defense)"],
      specialTank: pokemon["Special Tank(Special Attack + Special Defense)"],
      species: pokemon["Species"],
      height: pokemon["Height"],
      weight: pokemon["Weight"],
      abilityI: pokemon["Ability I"],
      abilityII: pokemon["Ability II"] || "",
      hiddenAbility: pokemon["Hidden Ability"] || "",
      evYield: pokemon["EV yield"],
      baseExp: pokemon["Base Exp"],
      eggGroupI: pokemon["Egg Group I"],
      eggGroupII: pokemon["Egg Group II"] || "",
      gender: pokemon["Gender"],
      generation: pokemon["Generation"],
      rarity: pokemon["Rarity"],
      normalSprite: pokemon["Normal Sprite"],
      shinySprite: pokemon["Shiny Sprite"],
      isVariant: false,
      isFavorite: false,
    }));
    
    // Load Moves data
    const movesPath = path.resolve(process.cwd(), "attached_assets/Moves.json");
    const movesData = JSON.parse(fs.readFileSync(movesPath, "utf-8"));
    this.moves = movesData.map((move: any) => ({
      name: move["Name"],
      type: move["Type"],
      category: move["Category"],
      power: move["Power"],
      accuracy: move["Accuracy"],
      pp: move["PP"],
      effect: move["Effect"],
      probability: move["Probability (%)"],
    }));
    
    // Load Natures data
    const naturesPath = path.resolve(process.cwd(), "attached_assets/Natures.json");
    const naturesData = JSON.parse(fs.readFileSync(naturesPath, "utf-8"));
    this.natures = naturesData.map((nature: any) => ({
      nature: nature["Nature"],
      increases: nature["Increases"],
      decreases: nature["Decreases"],
    }));
    
    // Load Regional Variants data
    const variantsPath = path.resolve(process.cwd(), "attached_assets/Regional Variants.json");
    const variantsData = JSON.parse(fs.readFileSync(variantsPath, "utf-8"));
    this.regionalVariants = variantsData.map((variant: any, index: number) => ({
      id: this.pokemon.length + index + 1,
      pokedexNumber: variant["Pokedex Number"],
      name: variant["Name"],
      primaryType: variant["Primary Type"],
      secondaryType: variant["Secondary Type"] || "",
      hp: variant["HP"],
      attack: variant["Attack"],
      defense: variant["Defense"],
      specialAttack: variant["Sp. Attack"],
      specialDefense: variant["Sp. Defense"],
      speed: variant["Speed"],
      total: variant["Total"],
      physicalSweeper: variant["Physical Sweeper(Attack + Speed)"],
      specialSweeper: variant["Special Sweeper(Special Attack + Speed)"],
      wall: variant["Wall(HP + Defense + Special Defense)"],
      physicalTank: variant["Physical Tank(Attack + Defense)"],
      specialTank: variant["Special Tank(Special Attack + Special Defense)"],
      species: variant["Species"],
      height: variant["Height"],
      weight: variant["Weight"],
      abilityI: variant["Ability I"],
      abilityII: variant["Ability II"] || "",
      hiddenAbility: variant["Hidden Ability"] || "",
      evYield: variant["EV yield"],
      baseExp: variant["Base Exp"],
      eggGroupI: variant["Egg Group I"],
      eggGroupII: variant["Egg Group II"] || "",
      gender: "50% male, 50% female", // Default value
      generation: variant["Generation"],
      rarity: "Normal", // Default value
      normalSprite: variant["Normal Sprite"],
      shinySprite: variant["Shiny Sprite"],
      isVariant: true,
      variantType: variant["Name"].includes("Alolan") ? "Alolan" : 
                  variant["Name"].includes("Galarian") ? "Galarian" :
                  variant["Name"].includes("Hisuian") ? "Hisuian" : "Unknown",
      isFavorite: false,
    }));
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
    const id = this.currentId++;
    const user: User = { ...insertUser, id, favorites: [] };
    this.users.set(id, user);
    return user;
  }

  async updateUserFavorites(userId: number, favorites: string[]): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    user.favorites = favorites;
    this.users.set(userId, user);
    return user;
  }

  async getAllPokemon(): Promise<Pokemon[]> {
    return [...this.pokemon, ...this.regionalVariants];
  }

  async getPokemonByNumber(pokedexNumber: string): Promise<Pokemon | undefined> {
    return [...this.pokemon, ...this.regionalVariants].find(
      p => p.pokedexNumber === pokedexNumber
    );
  }

  async getPokemonByName(name: string): Promise<Pokemon | undefined> {
    return [...this.pokemon, ...this.regionalVariants].find(
      p => p.name.toLowerCase() === name.toLowerCase()
    );
  }

  async getAllMoves(): Promise<Move[]> {
    return this.moves;
  }

  async getMoveByName(name: string): Promise<Move | undefined> {
    return this.moves.find(m => m.name.toLowerCase() === name.toLowerCase());
  }

  async getAllNatures(): Promise<Nature[]> {
    return this.natures;
  }

  async getRegionalVariants(): Promise<Pokemon[]> {
    return this.regionalVariants;
  }
}

export const storage = new MemStorage();
