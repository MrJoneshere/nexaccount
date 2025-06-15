import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { UsernameGenerator } from "./components/UsernameGenerator";
import { PasswordGenerator } from "./components/PasswordGenerator";
import { GenerationHistory } from "./components/GenerationHistory";
import { GenerateBoth } from "./components/GenerateBoth";

export function GeneratorApp() {
  const [activeTab, setActiveTab] = useState<"both" | "username" | "password" | "history">("both");
  const userPreferences = useQuery(api.generator.getUserPreferences);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (["both", "username", "password", "history"].includes(hash)) {
        setActiveTab(hash as any);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const tabs = [
    { id: "both" as const, label: "Generate Both", icon: "🎯" },
    { id: "username" as const, label: "Username Generator", icon: "👤" },
    { id: "password" as const, label: "Password Generator", icon: "🔒" },
    { id: "history" as const, label: "History", icon: "📝" },
  ];

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {activeTab === "both" && <GenerateBoth />}
        {activeTab === "username" && (
          <UsernameGenerator 
            defaultSettings={userPreferences?.usernameDefaults}
          />
        )}
        {activeTab === "password" && (
          <PasswordGenerator 
            defaultSettings={userPreferences?.passwordDefaults}
          />
        )}
        {activeTab === "history" && <GenerationHistory />}
      </div>
    </div>
  );
}
