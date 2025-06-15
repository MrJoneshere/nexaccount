import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { 
  getRandomAdjective, 
  getRandomNoun, 
  getRandomTechTerm, 
  getRandomPrefix, 
  getRandomSuffix,
  getThemedWords 
} from "./wordLists";

export const generateUsername = mutation({
  args: {
    length: v.number(),
    maxLength: v.optional(v.number()),
    useCapitalized: v.boolean(),
    useNumbers: v.boolean(),
    useLowercase: v.boolean(),
    useUppercase: v.boolean(),
    useSpecialChars: v.boolean(),
    separator: v.string(),
    wordCount: v.number(),
    prefix: v.string(),
    suffix: v.string(),
    theme: v.optional(v.string()),
    addRandomNumbers: v.optional(v.boolean()),
    numberCount: v.optional(v.number()),
    useRandomPrefix: v.optional(v.boolean()),
    useRandomSuffix: v.optional(v.boolean()),
    avoidCommonWords: v.optional(v.boolean()),
    saveToHistory: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let username = "";
    
    // Add random prefix if requested
    if (args.useRandomPrefix) {
      username += getRandomPrefix() + (args.separator || "");
    }
    
    // Add custom prefix
    if (args.prefix) {
      username += args.prefix + (args.separator || "");
    }
    
    // Generate based on word count
    if (args.wordCount > 0) {
      const words = [];
      for (let i = 0; i < args.wordCount; i++) {
        let word;
        
        if (args.theme && i < 2) {
          // Use themed words for first two words
          const themed = getThemedWords(args.theme);
          word = i === 0 ? themed.adjective : themed.noun;
        } else if (i % 3 === 0) {
          // Mix in tech terms occasionally
          word = Math.random() > 0.7 ? getRandomTechTerm() : getRandomAdjective();
        } else if (i % 2 === 0) {
          word = getRandomAdjective();
        } else {
          word = getRandomNoun();
        }
        
        // Apply case transformations
        if (args.useCapitalized) {
          word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else if (args.useLowercase && !args.useUppercase) {
          word = word.toLowerCase();
        } else if (args.useUppercase && !args.useLowercase) {
          word = word.toUpperCase();
        } else if (args.useLowercase && args.useUppercase) {
          // Random case for each character
          word = word.split('').map(char => 
            Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
          ).join('');
        }
        
        words.push(word);
      }
      username += words.join(args.separator);
    } else {
      // Generate random string
      let charset = "";
      if (args.useLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
      if (args.useUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (args.useNumbers) charset += "0123456789";
      if (args.useSpecialChars) charset += "_-";
      
      if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";
      
      for (let i = 0; i < args.length; i++) {
        username += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }
    
    // Add numbers if requested
    if (args.addRandomNumbers || (args.useNumbers && args.wordCount > 0)) {
      const numCount = args.numberCount || Math.floor(Math.random() * 4) + 1;
      let numbers = "";
      for (let i = 0; i < numCount; i++) {
        numbers += Math.floor(Math.random() * 10);
      }
      username += numbers;
    }
    
    // Add custom suffix
    if (args.suffix) {
      username += (args.separator || "") + args.suffix;
    }
    
    // Add random suffix if requested
    if (args.useRandomSuffix) {
      username += (args.separator || "") + getRandomSuffix();
    }
    
    // Apply maximum length limit if specified
    const maxLength = args.maxLength || args.length;
    if (maxLength > 0 && username.length > maxLength) {
      username = username.substring(0, maxLength);
    }
    
    // Save to history if requested
    if (args.saveToHistory) {
      await ctx.db.insert("generatedCredentials", {
        userId: "anonymous",
        type: "username",
        value: username,
        settings: {
          length: args.length,
          maxLength: args.maxLength,
          useCapitalized: args.useCapitalized,
          useNumbers: args.useNumbers,
          useLowercase: args.useLowercase,
          useUppercase: args.useUppercase,
          useSpecialChars: args.useSpecialChars,
          separator: args.separator,
          wordCount: args.wordCount,
          prefix: args.prefix,
          suffix: args.suffix,
          theme: args.theme,
          addRandomNumbers: args.addRandomNumbers,
          numberCount: args.numberCount,
          useRandomPrefix: args.useRandomPrefix,
          useRandomSuffix: args.useRandomSuffix,
        },
      });
    }
    
    return username;
  },
});

export const generatePassword = mutation({
  args: {
    length: v.number(),
    maxLength: v.optional(v.number()),
    includeUppercase: v.boolean(),
    includeLowercase: v.boolean(),
    includeNumbers: v.boolean(),
    includeSymbols: v.boolean(),
    excludeSimilar: v.boolean(),
    excludeAmbiguous: v.boolean(),
    customCharset: v.string(),
    pronounceable: v.optional(v.boolean()),
    noRepeatingChars: v.optional(v.boolean()),
    mustStartWithLetter: v.optional(v.boolean()),
    mustEndWithNumber: v.optional(v.boolean()),
    minUppercase: v.optional(v.number()),
    minLowercase: v.optional(v.number()),
    minNumbers: v.optional(v.number()),
    minSymbols: v.optional(v.number()),
    saveToHistory: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let charset = "";
    
    if (args.customCharset) {
      charset = args.customCharset;
    } else {
      if (args.includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
      if (args.includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (args.includeNumbers) charset += "0123456789";
      if (args.includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    }
    
    if (!charset) {
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    }
    
    // Remove similar characters if requested
    if (args.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "");
    }
    
    // Remove ambiguous characters if requested
    if (args.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;.<>]/g, "");
    }
    
    // Use maxLength if specified, otherwise use length
    const targetLength = Math.min(args.length, args.maxLength || args.length);
    
    let password = "";
    
    if (args.pronounceable) {
      // Generate pronounceable password using consonant-vowel patterns
      const consonants = "bcdfghjklmnpqrstvwxyz";
      const vowels = "aeiou";
      
      for (let i = 0; i < targetLength; i++) {
        if (i % 2 === 0) {
          password += consonants.charAt(Math.floor(Math.random() * consonants.length));
        } else {
          password += vowels.charAt(Math.floor(Math.random() * vowels.length));
        }
      }
      
      // Add numbers and symbols if required
      if (args.includeNumbers) {
        const pos = Math.floor(Math.random() * password.length);
        password = password.substring(0, pos) + Math.floor(Math.random() * 10) + password.substring(pos + 1);
      }
      
      if (args.includeSymbols) {
        const symbols = "!@#$%^&*";
        const pos = Math.floor(Math.random() * password.length);
        password = password.substring(0, pos) + symbols.charAt(Math.floor(Math.random() * symbols.length)) + password.substring(pos + 1);
      }
    } else {
      // Generate random password
      const usedChars = new Set<string>();
      
      for (let i = 0; i < targetLength; i++) {
        let char;
        let attempts = 0;
        
        do {
          char = charset.charAt(Math.floor(Math.random() * charset.length));
          attempts++;
        } while (args.noRepeatingChars && usedChars.has(char) && attempts < 100);
        
        password += char;
        if (args.noRepeatingChars) usedChars.add(char);
      }
    }
    
    // Ensure minimum character requirements
    if (!args.customCharset && targetLength >= 4) {
      const requirements = [];
      if (args.includeLowercase) requirements.push({ chars: "abcdefghijklmnopqrstuvwxyz", min: args.minLowercase || 1 });
      if (args.includeUppercase) requirements.push({ chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", min: args.minUppercase || 1 });
      if (args.includeNumbers) requirements.push({ chars: "0123456789", min: args.minNumbers || 1 });
      if (args.includeSymbols) requirements.push({ chars: "!@#$%^&*()_+-=[]{}|;:,.<>?", min: args.minSymbols || 1 });
      
      requirements.forEach((req, index) => {
        for (let i = 0; i < req.min && index < password.length; i++) {
          let validChars = req.chars;
          if (args.excludeSimilar) validChars = validChars.replace(/[il1Lo0O]/g, "");
          if (args.excludeAmbiguous) validChars = validChars.replace(/[{}[\]()\/\\'"~,;.<>]/g, "");
          
          if (validChars) {
            const pos = Math.min(index + i, password.length - 1);
            password = password.substring(0, pos) + 
                      validChars.charAt(Math.floor(Math.random() * validChars.length)) + 
                      password.substring(pos + 1);
          }
        }
      });
    }
    
    // Ensure starts with letter if required
    if (args.mustStartWithLetter) {
      const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      password = letters.charAt(Math.floor(Math.random() * letters.length)) + password.substring(1);
    }
    
    // Ensure ends with number if required
    if (args.mustEndWithNumber) {
      const numbers = "0123456789";
      password = password.substring(0, password.length - 1) + numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    // Save to history if requested
    if (args.saveToHistory) {
      await ctx.db.insert("generatedCredentials", {
        userId: "anonymous",
        type: "password",
        value: password,
        settings: {
          length: args.length,
          maxLength: args.maxLength,
          includeUppercase: args.includeUppercase,
          includeLowercase: args.includeLowercase,
          includeNumbers: args.includeNumbers,
          includeSymbols: args.includeSymbols,
          excludeSimilar: args.excludeSimilar,
          excludeAmbiguous: args.excludeAmbiguous,
          customCharset: args.customCharset,
          pronounceable: args.pronounceable,
          noRepeatingChars: args.noRepeatingChars,
          mustStartWithLetter: args.mustStartWithLetter,
          mustEndWithNumber: args.mustEndWithNumber,
        },
      });
    }
    
    return password;
  },
});

export const generateMultiple = mutation({
  args: {
    type: v.union(v.literal("username"), v.literal("password")),
    count: v.number(),
    settings: v.any(),
  },
  handler: async (ctx, args): Promise<string[]> => {
    const results: string[] = [];
    
    for (let i = 0; i < Math.min(args.count, 20); i++) {
      if (args.type === "username") {
        const username: string = await ctx.runMutation(api.generator.generateUsername, {
          ...args.settings,
          saveToHistory: false,
        });
        results.push(username);
      } else {
        const password: string = await ctx.runMutation(api.generator.generatePassword, {
          ...args.settings,
          saveToHistory: false,
        });
        results.push(password);
      }
    }
    
    return results;
  },
});

export const checkUsernameAvailability = mutation({
  args: {
    username: v.string(),
    platforms: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // This is a mock implementation - in a real app, you'd check actual platforms
    const results: Record<string, boolean> = {};
    
    for (const platform of args.platforms) {
      // Simulate availability check with some randomness
      const hash = args.username.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      results[platform] = Math.abs(hash) % 3 !== 0; // ~66% availability rate
    }
    
    return results;
  },
});

export const getGenerationHistory = query({
  args: {
    type: v.optional(v.union(v.literal("username"), v.literal("password"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results;
    
    if (args.type) {
      results = await ctx.db.query("generatedCredentials")
        .withIndex("by_user_and_type", (q) => q.eq("userId", "anonymous").eq("type", args.type!))
        .order("desc")
        .take(args.limit || 50);
    } else {
      results = await ctx.db.query("generatedCredentials")
        .withIndex("by_user", (q) => q.eq("userId", "anonymous"))
        .order("desc")
        .take(args.limit || 50);
    }
    
    return results;
  },
});

export const toggleFavorite = mutation({
  args: {
    credentialId: v.id("generatedCredentials"),
  },
  handler: async (ctx, args) => {
    const credential = await ctx.db.get(args.credentialId);
    if (!credential || credential.userId !== "anonymous") {
      throw new Error("Credential not found or access denied");
    }

    await ctx.db.patch(args.credentialId, {
      isFavorite: !credential.isFavorite,
    });
  },
});

export const deleteCredential = mutation({
  args: {
    credentialId: v.id("generatedCredentials"),
  },
  handler: async (ctx, args) => {
    const credential = await ctx.db.get(args.credentialId);
    if (!credential || credential.userId !== "anonymous") {
      throw new Error("Credential not found or access denied");
    }

    await ctx.db.delete(args.credentialId);
  },
});

export const saveUserPreferences = mutation({
  args: {
    usernameDefaults: v.object({
      length: v.number(),
      maxLength: v.optional(v.number()),
      useCapitalized: v.boolean(),
      useNumbers: v.boolean(),
      useLowercase: v.boolean(),
      useUppercase: v.boolean(),
      useSpecialChars: v.boolean(),
      separator: v.string(),
      wordCount: v.number(),
      prefix: v.string(),
      suffix: v.string(),
      theme: v.optional(v.string()),
      addRandomNumbers: v.optional(v.boolean()),
      numberCount: v.optional(v.number()),
      useRandomPrefix: v.optional(v.boolean()),
      useRandomSuffix: v.optional(v.boolean()),
    }),
    passwordDefaults: v.object({
      length: v.number(),
      maxLength: v.optional(v.number()),
      includeUppercase: v.boolean(),
      includeLowercase: v.boolean(),
      includeNumbers: v.boolean(),
      includeSymbols: v.boolean(),
      excludeSimilar: v.boolean(),
      excludeAmbiguous: v.boolean(),
      customCharset: v.string(),
      pronounceable: v.optional(v.boolean()),
      noRepeatingChars: v.optional(v.boolean()),
      mustStartWithLetter: v.optional(v.boolean()),
      mustEndWithNumber: v.optional(v.boolean()),
    }),
    darkMode: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", "anonymous"))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        usernameDefaults: args.usernameDefaults,
        passwordDefaults: args.passwordDefaults,
        darkMode: args.darkMode,
      });
    } else {
      await ctx.db.insert("userPreferences", {
        userId: "anonymous",
        usernameDefaults: args.usernameDefaults,
        passwordDefaults: args.passwordDefaults,
        darkMode: args.darkMode,
      });
    }
  },
});

export const getUserPreferences = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", "anonymous"))
      .unique();
  },
});

// Import api for internal calls
import { api } from "./_generated/api";
