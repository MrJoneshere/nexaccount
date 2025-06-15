import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface UsernameSettings {
  length: number;
  maxLength?: number;
  useCapitalized: boolean;
  useNumbers: boolean;
  useLowercase: boolean;
  useUppercase: boolean;
  useSpecialChars: boolean;
  separator: string;
  wordCount: number;
  prefix: string;
  suffix: string;
  theme?: string;
  addRandomNumbers?: boolean;
  numberCount?: number;
  useRandomPrefix?: boolean;
  useRandomSuffix?: boolean;
}

interface Props {
  defaultSettings?: UsernameSettings;
}

export function UsernameGenerator({ defaultSettings }: Props) {
  const userPreferences = useQuery(api.generator.getUserPreferences);
  const [settings, setSettings] = useState<UsernameSettings>({
    length: 12,
    maxLength: undefined,
    useCapitalized: true,
    useNumbers: true,
    useLowercase: false,
    useUppercase: false,
    useSpecialChars: false,
    separator: "",
    wordCount: 2,
    prefix: "",
    suffix: "",
  });

  const [generatedUsername, setGeneratedUsername] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUsername = useMutation(api.generator.generateUsername);
  const savePreferences = useMutation(api.generator.saveUserPreferences);

  // Load user preferences when available
  useEffect(() => {
    if (userPreferences?.usernameDefaults) {
      setSettings(userPreferences.usernameDefaults);
    } else if (defaultSettings) {
      setSettings(defaultSettings);
    }
  }, [userPreferences, defaultSettings]);

  // Auto-save settings when they change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userPreferences) {
        savePreferences({
          usernameDefaults: settings,
          passwordDefaults: userPreferences.passwordDefaults,
          darkMode: userPreferences.darkMode,
        }).catch(() => {
          // Silent fail for auto-save
        });
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [settings, userPreferences, savePreferences]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const username = await generateUsername({
        ...settings,
        saveToHistory: true,
      });
      setGeneratedUsername(username);
      toast.success("Username generated!");
    } catch (error) {
      toast.error("Failed to generate username");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedUsername) {
      await navigator.clipboard.writeText(generatedUsername);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Username Generator</h2>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Settings auto-save
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Settings</h3>
          
          {/* Generation Mode */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Generation Mode
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={settings.wordCount > 0}
                  onChange={() => setSettings(s => ({ ...s, wordCount: 2 }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Word-based</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={settings.wordCount === 0}
                  onChange={() => setSettings(s => ({ ...s, wordCount: 0 }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Random characters</span>
              </label>
            </div>
          </div>

          {/* Word Settings */}
          {settings.wordCount > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Words: {settings.wordCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={settings.wordCount}
                  onChange={(e) => setSettings(s => ({ ...s, wordCount: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Separator
                </label>
                <select
                  value={settings.separator}
                  onChange={(e) => setSettings(s => ({ ...s, separator: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">None</option>
                  <option value="_">Underscore (_)</option>
                  <option value="-">Dash (-)</option>
                  <option value=".">Dot (.)</option>
                </select>
              </div>
            </div>
          )}

          {/* Length Settings */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 space-y-4">
            {settings.wordCount === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Length: {settings.length}
                </label>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={settings.length}
                  onChange={(e) => setSettings(s => ({ ...s, length: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={settings.maxLength !== undefined}
                  onChange={(e) => setSettings(s => ({ 
                    ...s, 
                    maxLength: e.target.checked ? (s.length || 20) : undefined 
                  }))}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Set maximum length
                </label>
              </div>
              {settings.maxLength !== undefined && (
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxLength}
                  onChange={(e) => setSettings(s => ({ ...s, maxLength: parseInt(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Max characters"
                />
              )}
            </div>
          </div>

          {/* Character Options */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Character Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.useCapitalized}
                  onChange={(e) => setSettings(s => ({ ...s, useCapitalized: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Capitalized</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.useLowercase}
                  onChange={(e) => setSettings(s => ({ ...s, useLowercase: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Lowercase</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.useUppercase}
                  onChange={(e) => setSettings(s => ({ ...s, useUppercase: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Uppercase</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.useNumbers}
                  onChange={(e) => setSettings(s => ({ ...s, useNumbers: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Include Numbers</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.useSpecialChars}
                  onChange={(e) => setSettings(s => ({ ...s, useSpecialChars: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Special Characters (_ -)</span>
              </label>
            </div>
          </div>

          {/* Prefix/Suffix */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prefix
              </label>
              <input
                type="text"
                value={settings.prefix}
                onChange={(e) => setSettings(s => ({ ...s, prefix: e.target.value }))}
                placeholder="Optional prefix"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Suffix
              </label>
              <input
                type="text"
                value={settings.suffix}
                onChange={(e) => setSettings(s => ({ ...s, suffix: e.target.value }))}
                placeholder="Optional suffix"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Generation Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Generated Username</h3>
          
          <div className="space-y-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              {isGenerating ? "Generating..." : "Generate Username"}
            </button>

            {generatedUsername && (
              <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</span>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm transition-colors dark:text-gray-300"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-lg break-all bg-gray-50 dark:bg-gray-900 p-3 rounded border dark:border-gray-600 dark:text-gray-200">
                  {generatedUsername}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Length: {generatedUsername.length} characters
                  {settings.maxLength && generatedUsername.length === settings.maxLength && (
                    <span className="text-orange-600 dark:text-orange-400 ml-2">• Trimmed to max length</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Quick Presets</h4>
            <div className="space-y-2">
              <button
                onClick={() => setSettings({
                  length: 12,
                  maxLength: 20,
                  useCapitalized: true,
                  useNumbers: true,
                  useLowercase: false,
                  useUppercase: false,
                  useSpecialChars: false,
                  separator: "",
                  wordCount: 2,
                  prefix: "",
                  suffix: "",
                })}
                className="w-full px-3 py-2 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded border dark:border-gray-600 transition-colors"
              >
                <div className="font-medium dark:text-gray-200">Simple & Clean</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">2 words, numbers, max 20 chars</div>
              </button>
              
              <button
                onClick={() => setSettings({
                  length: 16,
                  maxLength: 25,
                  useCapitalized: false,
                  useNumbers: true,
                  useLowercase: true,
                  useUppercase: true,
                  useSpecialChars: true,
                  separator: "_",
                  wordCount: 3,
                  prefix: "",
                  suffix: "",
                })}
                className="w-full px-3 py-2 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded border dark:border-gray-600 transition-colors"
              >
                <div className="font-medium dark:text-gray-200">Complex & Secure</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">3 words, mixed case, max 25 chars</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
