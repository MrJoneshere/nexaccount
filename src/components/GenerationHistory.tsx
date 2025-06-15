import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function GenerationHistory() {
  const [filter, setFilter] = useState<"all" | "username" | "password">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const history = useQuery(api.generator.getGenerationHistory, {
    type: filter === "all" ? undefined : filter,
    limit: 100,
  });

  const toggleFavorite = useMutation(api.generator.toggleFavorite);
  const deleteCredential = useMutation(api.generator.deleteCredential);

  const filteredHistory = history?.filter(item => 
    !showFavoritesOnly || item.isFavorite
  ) || [];

  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  const handleToggleFavorite = async (id: Id<"generatedCredentials">) => {
    try {
      await toggleFavorite({ credentialId: id });
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  const handleDelete = async (id: Id<"generatedCredentials">) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteCredential({ credentialId: id });
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error("Failed to delete item");
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSettingsSummary = (settings: any, type: string) => {
    if (type === "username") {
      const parts = [];
      if (settings.wordCount > 0) {
        parts.push(`${settings.wordCount} words`);
        if (settings.separator) parts.push(`separator: "${settings.separator}"`);
      } else {
        parts.push(`${settings.length} chars`);
      }
      if (settings.useCapitalized) parts.push("capitalized");
      if (settings.useNumbers) parts.push("numbers");
      if (settings.prefix) parts.push(`prefix: "${settings.prefix}"`);
      if (settings.suffix) parts.push(`suffix: "${settings.suffix}"`);
      return parts.join(", ");
    } else {
      const parts = [`${settings.length} chars`];
      const types = [];
      if (settings.includeUppercase) types.push("A-Z");
      if (settings.includeLowercase) types.push("a-z");
      if (settings.includeNumbers) types.push("0-9");
      if (settings.includeSymbols) types.push("symbols");
      if (types.length > 0) parts.push(types.join(", "));
      if (settings.excludeSimilar) parts.push("no similar");
      if (settings.excludeAmbiguous) parts.push("no ambiguous");
      return parts.join(", ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Generation History</h2>
        <div className="text-sm text-gray-600">
          {filteredHistory.length} items
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("username")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              filter === "username"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Usernames
          </button>
          <button
            onClick={() => setFilter("password")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              filter === "password"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Passwords
          </button>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Favorites only</span>
        </label>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-lg font-medium mb-2">No items found</p>
            <p>
              {showFavoritesOnly 
                ? "You haven't favorited any items yet."
                : "Generate some usernames or passwords to see them here."
              }
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === "username"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {item.type === "username" ? "👤" : "🔒"} {item.type}
                    </span>
                    {item.isFavorite && (
                      <span className="text-yellow-500">⭐</span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDate(item._creationTime)}
                    </span>
                  </div>
                  
                  <div className="font-mono text-lg mb-2 break-all">
                    {item.type === "password" ? "•".repeat(item.value.length) : item.value}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {getSettingsSummary(item.settings, item.type)}
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => handleToggleFavorite(item._id)}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                      item.isFavorite ? "text-yellow-500" : "text-gray-400"
                    }`}
                    title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => copyToClipboard(item.value)}
                    className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded hover:bg-gray-100 text-red-600 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
