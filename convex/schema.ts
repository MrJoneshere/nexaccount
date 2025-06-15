import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  generatedCredentials: defineTable({
    userId: v.string(), // Changed to string for anonymous users
    type: v.union(v.literal("username"), v.literal("password")),
    value: v.string(),
    settings: v.object({
      // Username settings
      length: v.optional(v.number()),
      maxLength: v.optional(v.number()),
      useCapitalized: v.optional(v.boolean()),
      useNumbers: v.optional(v.boolean()),
      useLowercase: v.optional(v.boolean()),
      useUppercase: v.optional(v.boolean()),
      useSpecialChars: v.optional(v.boolean()),
      separator: v.optional(v.string()),
      wordCount: v.optional(v.number()),
      prefix: v.optional(v.string()),
      suffix: v.optional(v.string()),
      theme: v.optional(v.string()),
      addRandomNumbers: v.optional(v.boolean()),
      numberCount: v.optional(v.number()),
      useRandomPrefix: v.optional(v.boolean()),
      useRandomSuffix: v.optional(v.boolean()),
      // Password settings
      includeUppercase: v.optional(v.boolean()),
      includeLowercase: v.optional(v.boolean()),
      includeNumbers: v.optional(v.boolean()),
      includeSymbols: v.optional(v.boolean()),
      excludeSimilar: v.optional(v.boolean()),
      excludeAmbiguous: v.optional(v.boolean()),
      customCharset: v.optional(v.string()),
      pronounceable: v.optional(v.boolean()),
      noRepeatingChars: v.optional(v.boolean()),
      mustStartWithLetter: v.optional(v.boolean()),
      mustEndWithNumber: v.optional(v.boolean()),
    }),
    isFavorite: v.optional(v.boolean()),
  }).index("by_user", ["userId"]).index("by_user_and_type", ["userId", "type"]),
  
  userPreferences: defineTable({
    userId: v.string(), // Changed to string for anonymous users
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
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
