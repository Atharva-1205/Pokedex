export interface Pokemon {
  id: number;
  pokedexNumber: string;
  name: string;
  primaryType: string;
  secondaryType?: string;
  hp: string;
  attack: string;
  defense: string;
  specialAttack: string;
  specialDefense: string;
  speed: string;
  total: string;
  physicalSweeper: string;
  specialSweeper: string;
  wall: string;
  physicalTank: string;
  specialTank: string;
  species: string;
  height: string;
  weight: string;
  abilityI: string;
  abilityII?: string;
  hiddenAbility?: string;
  evYield: string;
  baseExp: string;
  eggGroupI: string;
  eggGroupII?: string;
  gender: string;
  generation: string;
  rarity?: string;
  normalSprite: string;
  shinySprite: string;
  isVariant: boolean;
  variantType?: string;
  isFavorite: boolean;
}

export interface Move {
  name: string;
  type: string;
  category: string;
  power: string;
  accuracy: string;
  pp: string;
  effect: string;
  probability: string;
}

export interface Nature {
  nature: string;
  increases: string;
  decreases: string;
}

export interface PokemonFilters {
  search: string;
  generation: string[];
  types: string[];
  eggGroups: string[];
  showMega: boolean;
  showRegionalVariants: boolean;
  showGigantamax: boolean;
}

export interface TypeEffectiveness {
  weak: string[];
  veryWeak: string[];
  resistant: string[];
  veryResistant: string[];
  immune: string[];
}

export interface StatCalculatorState {
  level: number;
  nature: string;
  ivs: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  evs: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}
