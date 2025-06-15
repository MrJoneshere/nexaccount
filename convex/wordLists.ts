// Comprehensive word lists for unlimited username generation
export const adjectives = [
  // Positive adjectives
  "Amazing", "Awesome", "Brilliant", "Creative", "Dynamic", "Epic", "Fantastic", "Glorious", 
  "Happy", "Incredible", "Joyful", "Keen", "Legendary", "Mighty", "Noble", "Outstanding", 
  "Powerful", "Quick", "Radiant", "Strong", "Triumphant", "Ultimate", "Vibrant", "Wonderful", 
  "Xenial", "Youthful", "Zealous", "Bold", "Clever", "Daring", "Elegant", "Fierce",
  "Graceful", "Heroic", "Inspiring", "Jovial", "Kind", "Lively", "Majestic", "Nimble",
  
  // Colors
  "Red", "Blue", "Green", "Golden", "Silver", "Purple", "Orange", "Pink", "Black", "White",
  "Crimson", "Azure", "Emerald", "Amber", "Violet", "Scarlet", "Turquoise", "Magenta",
  "Coral", "Indigo", "Jade", "Ruby", "Sapphire", "Pearl", "Diamond", "Crystal",
  
  // Weather/Nature
  "Sunny", "Stormy", "Misty", "Frosty", "Windy", "Cloudy", "Starry", "Lunar", "Solar",
  "Thunder", "Lightning", "Rainbow", "Aurora", "Cosmic", "Stellar", "Nebula",
  
  // Emotions/Traits
  "Brave", "Calm", "Wise", "Swift", "Silent", "Loud", "Gentle", "Wild", "Free", "Pure",
  "Sharp", "Smooth", "Rough", "Soft", "Hard", "Light", "Dark", "Bright", "Dim",
  
  // Sizes
  "Tiny", "Small", "Big", "Huge", "Giant", "Mini", "Mega", "Ultra", "Super", "Micro",
  "Massive", "Colossal", "Enormous", "Petite", "Compact", "Vast", "Immense",
  
  // Tech/Modern
  "Digital", "Cyber", "Virtual", "Quantum", "Neural", "Binary", "Pixel", "Neon",
  "Electric", "Magnetic", "Atomic", "Laser", "Plasma", "Holographic", "Synthetic"
];

export const nouns = [
  // Animals
  "Tiger", "Eagle", "Dragon", "Phoenix", "Wolf", "Lion", "Falcon", "Shark", "Panther", "Hawk",
  "Bear", "Fox", "Raven", "Viper", "Cobra", "Jaguar", "Leopard", "Cheetah", "Rhino", "Elephant",
  "Dolphin", "Whale", "Octopus", "Spider", "Scorpion", "Butterfly", "Hummingbird", "Owl",
  "Penguin", "Kangaroo", "Koala", "Panda", "Zebra", "Giraffe", "Hippo", "Crocodile",
  
  // Mythical creatures
  "Unicorn", "Griffin", "Kraken", "Hydra", "Chimera", "Sphinx", "Pegasus", "Cerberus",
  "Basilisk", "Gargoyle", "Banshee", "Valkyrie", "Minotaur", "Centaur", "Siren",
  
  // Warriors/Heroes
  "Warrior", "Knight", "Hunter", "Ranger", "Guardian", "Champion", "Hero", "Legend",
  "Master", "Sage", "Wizard", "Ninja", "Samurai", "Gladiator", "Viking", "Spartan",
  "Titan", "Giant", "Paladin", "Archer", "Assassin", "Berserker", "Crusader",
  
  // Elements/Forces
  "Storm", "Thunder", "Lightning", "Fire", "Ice", "Wind", "Earth", "Water", "Shadow",
  "Light", "Darkness", "Flame", "Frost", "Blaze", "Tempest", "Cyclone", "Tsunami",
  "Avalanche", "Earthquake", "Volcano", "Meteor", "Comet", "Star", "Moon", "Sun",
  
  // Objects/Weapons
  "Sword", "Shield", "Bow", "Arrow", "Spear", "Axe", "Hammer", "Blade", "Dagger",
  "Staff", "Wand", "Orb", "Crystal", "Gem", "Crown", "Throne", "Castle", "Tower",
  "Bridge", "Gate", "Key", "Lock", "Chain", "Ring", "Amulet", "Talisman",
  
  // Tech/Sci-fi
  "Cyber", "Matrix", "Vector", "Pixel", "Byte", "Code", "Data", "Signal", "Circuit",
  "Engine", "Reactor", "Laser", "Plasma", "Quantum", "Neural", "Binary", "Digital",
  "Virtual", "Hologram", "Android", "Cyborg", "Robot", "Drone", "Satellite",
  
  // Nature
  "Mountain", "Valley", "River", "Ocean", "Forest", "Desert", "Jungle", "Meadow",
  "Canyon", "Cliff", "Peak", "Summit", "Ridge", "Grove", "Oasis", "Reef", "Island",
  "Glacier", "Tundra", "Prairie", "Savanna", "Rainforest", "Waterfall", "Geyser"
];

export const techTerms = [
  "Alpha", "Beta", "Gamma", "Delta", "Omega", "Prime", "Core", "Node", "Hub", "Link",
  "Sync", "Flow", "Stream", "Wave", "Pulse", "Spark", "Flash", "Bolt", "Surge", "Rush",
  "Boost", "Turbo", "Nitro", "Hyper", "Ultra", "Mega", "Giga", "Tera", "Nano", "Micro",
  "Proto", "Meta", "Neo", "Retro", "Vintage", "Modern", "Future", "Next", "Pro", "Max"
];

export const prefixes = [
  "Mr", "Ms", "Dr", "Sir", "Lord", "Lady", "King", "Queen", "Prince", "Princess",
  "Captain", "Major", "General", "Admiral", "Chief", "Boss", "Master", "Expert",
  "Pro", "Elite", "Super", "Ultra", "Mega", "Hyper", "Alpha", "Beta", "Prime"
];

export const suffixes = [
  "Jr", "Sr", "II", "III", "Pro", "Max", "Plus", "Elite", "Prime", "Alpha", "Beta",
  "X", "Z", "Neo", "Ultra", "Super", "Mega", "Turbo", "Nitro", "Boost", "Rush"
];

// Function to get random words with variety
export function getRandomAdjective(): string {
  return adjectives[Math.floor(Math.random() * adjectives.length)];
}

export function getRandomNoun(): string {
  return nouns[Math.floor(Math.random() * nouns.length)];
}

export function getRandomTechTerm(): string {
  return techTerms[Math.floor(Math.random() * techTerms.length)];
}

export function getRandomPrefix(): string {
  return prefixes[Math.floor(Math.random() * prefixes.length)];
}

export function getRandomSuffix(): string {
  return suffixes[Math.floor(Math.random() * suffixes.length)];
}

// Generate themed word combinations
export function getThemedWords(theme: string): { adjective: string; noun: string } {
  switch (theme) {
    case "fantasy":
      const fantasyAdj = ["Mystic", "Ancient", "Sacred", "Cursed", "Blessed", "Eternal", "Divine", "Infernal"];
      const fantasyNoun = ["Dragon", "Phoenix", "Unicorn", "Griffin", "Wizard", "Knight", "Castle", "Sword"];
      return {
        adjective: fantasyAdj[Math.floor(Math.random() * fantasyAdj.length)],
        noun: fantasyNoun[Math.floor(Math.random() * fantasyNoun.length)]
      };
    
    case "tech":
      const techAdj = ["Digital", "Cyber", "Quantum", "Neural", "Binary", "Virtual", "Atomic", "Laser"];
      const techNoun = ["Matrix", "Vector", "Pixel", "Code", "Signal", "Engine", "Reactor", "Circuit"];
      return {
        adjective: techAdj[Math.floor(Math.random() * techAdj.length)],
        noun: techNoun[Math.floor(Math.random() * techNoun.length)]
      };
    
    case "nature":
      const natureAdj = ["Wild", "Free", "Pure", "Natural", "Organic", "Fresh", "Green", "Blue"];
      const natureNoun = ["Mountain", "River", "Forest", "Ocean", "Eagle", "Wolf", "Bear", "Tiger"];
      return {
        adjective: natureAdj[Math.floor(Math.random() * natureAdj.length)],
        noun: natureNoun[Math.floor(Math.random() * natureNoun.length)]
      };
    
    default:
      return {
        adjective: getRandomAdjective(),
        noun: getRandomNoun()
      };
  }
}
