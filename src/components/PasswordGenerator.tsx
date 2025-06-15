import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface PasswordSettings {
  length: number;
  maxLength?: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  customCharset: string;
  pronounceable?: boolean;
  noRepeatingChars?: boolean;
  mustStartWithLetter?: boolean;
  mustEndWithNumber?: boolean;
}

interface Props {
  defaultSettings?: PasswordSettings;
}

export function PasswordGenerator({ defaultSettings }: Props) {
  const userPreferences = useQuery(api.generator.getUserPreferences);
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 16,
    maxLength: undefined,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
    customCharset: "",
  });

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const generatePassword = useMutation(api.generator.generatePassword);
  const savePreferences = useMutation(api.generator.saveUserPreferences);

  // Load user preferences when available
  useEffect(() => {
    if (userPreferences?.passwordDefaults) {
      setSettings(userPreferences.passwordDefaults);
    } else if (defaultSettings) {
      setSettings(defaultSettings);
    }
  }, [userPreferences, defaultSettings]);

  // Auto-save settings when they change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userPreferences) {
        savePreferences({
          passwordDefaults: settings,
          usernameDefaults: userPreferences.usernameDefaults,
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
      const password = await generatePassword({
        ...settings,
        saveToHistory: true,
      });
      setGeneratedPassword(password);
      toast.success("Password generated!");
    } catch (error) {
      toast.error("Failed to generate password");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      toast.success("Copied to clipboard!");
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { level: "Weak", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20" };
    if (score <= 4) return { level: "Medium", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20" };
    return { level: "Strong", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" };
  };

  const strength = generatedPassword ? getPasswordStrength(generatedPassword) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Password Generator</h2>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Settings auto-save
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Settings</h3>
          
          {/* Length Settings */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Length: {settings.length}
              </label>
              <input
                type="range"
                min="4"
                max="128"
                value={settings.length}
                onChange={(e) => setSettings(s => ({ ...s, length: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={settings.maxLength !== undefined}
                  onChange={(e) => setSettings(s => ({ 
                    ...s, 
                    maxLength: e.target.checked ? s.length : undefined 
                  }))}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Set exact length
                </label>
              </div>
              {settings.maxLength !== undefined && (
                <input
                  type="number"
                  min="4"
                  max="128"
                  value={settings.maxLength}
                  onChange={(e) => setSettings(s => ({ ...s, maxLength: parseInt(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Exact length"
                />
              )}
            </div>
          </div>

          {/* Character Types */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Include Characters
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeUppercase}
                  onChange={(e) => setSettings(s => ({ ...s, includeUppercase: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeLowercase}
                  onChange={(e) => setSettings(s => ({ ...s, includeLowercase: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeNumbers}
                  onChange={(e) => setSettings(s => ({ ...s, includeNumbers: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Numbers (0-9)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeSymbols}
                  onChange={(e) => setSettings(s => ({ ...s, includeSymbols: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Symbols (!@#$...)</span>
              </label>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Advanced Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.excludeSimilar}
                  onChange={(e) => setSettings(s => ({ ...s, excludeSimilar: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Exclude similar (i, l, 1, L, o, 0, O)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.excludeAmbiguous}
                  onChange={(e) => setSettings(s => ({ ...s, excludeAmbiguous: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm dark:text-gray-300">Exclude ambiguous ({`{} [] () / \\ ' "`})</span>
              </label>
            </div>
          </div>

          {/* Custom Character Set */}
          {settings.customCharset !== undefined && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Characters (Optional)
              </label>
              <textarea
                value={settings.customCharset}
                onChange={(e) => setSettings(s => ({ ...s, customCharset: e.target.value }))}
                placeholder="Enter custom characters..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Generation Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Generated Password</h3>
          
          <div className="space-y-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              {isGenerating ? "Generating..." : "Generate Password"}
            </button>

            {generatedPassword && (
              <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</span>
                    {strength && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${strength.bg} ${strength.color}`}>
                        {strength.level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs transition-colors dark:text-gray-300"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm transition-colors dark:text-gray-300"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="font-mono text-lg break-all bg-gray-50 dark:bg-gray-900 p-3 rounded border dark:border-gray-600 dark:text-gray-200">
                  {showPassword ? generatedPassword : "•".repeat(generatedPassword.length)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Length: {generatedPassword.length} characters
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
                  maxLength: 12,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: false,
                  excludeSimilar: true,
                  excludeAmbiguous: false,
                  customCharset: "",
                })}
                className="w-full px-3 py-2 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded border dark:border-gray-600 transition-colors"
              >
                <div className="font-medium dark:text-gray-200">Easy to Type</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">12 chars, no symbols, no similar</div>
              </button>
              
              <button
                onClick={() => setSettings({
                  length: 16,
                  maxLength: 16,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: true,
                  excludeSimilar: false,
                  excludeAmbiguous: false,
                  customCharset: "",
                })}
                className="w-full px-3 py-2 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded border dark:border-gray-600 transition-colors"
              >
                <div className="font-medium dark:text-gray-200">Balanced</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">16 chars, all character types</div>
              </button>
              
              <button
                onClick={() => setSettings({
                  length: 32,
                  maxLength: 32,
                  includeUppercase: true,
                  includeLowercase: true,
                  includeNumbers: true,
                  includeSymbols: true,
                  excludeSimilar: true,
                  excludeAmbiguous: true,
                  customCharset: "",
                })}
                className="w-full px-3 py-2 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded border dark:border-gray-600 transition-colors"
              >
                <div className="font-medium dark:text-gray-200">Maximum Security</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">32 chars, exclude confusing</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
