import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface GeneratedPair {
  username: string;
  password: string;
}

export function GenerateBoth() {
  const [generatedPair, setGeneratedPair] = useState<GeneratedPair | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const generateUsername = useMutation(api.generator.generateUsername);
  const generatePassword = useMutation(api.generator.generatePassword);
  const userPreferences = useQuery(api.generator.getUserPreferences);

  const handleGenerateBoth = async () => {
    setIsGenerating(true);
    try {
      // Use user preferences or defaults
      const usernameSettings = userPreferences?.usernameDefaults || {
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
      };

      const passwordSettings = userPreferences?.passwordDefaults || {
        length: 16,
        maxLength: undefined,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false,
        customCharset: "",
      };

      // Generate both simultaneously
      const [username, password] = await Promise.all([
        generateUsername({
          ...usernameSettings,
          saveToHistory: true,
        }),
        generatePassword({
          ...passwordSettings,
          saveToHistory: true,
        }),
      ]);

      setGeneratedPair({ username, password });
      toast.success("Credentials generated!");
    } catch (error) {
      toast.error("Failed to generate credentials");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyBothToClipboard = async () => {
    if (generatedPair) {
      const text = `Username: ${generatedPair.username}\nPassword: ${generatedPair.password}`;
      await navigator.clipboard.writeText(text);
      toast.success("Both copied to clipboard!");
    }
  };

  const copyUsernameToClipboard = async () => {
    if (generatedPair) {
      await navigator.clipboard.writeText(generatedPair.username);
      toast.success("Username copied!");
    }
  };

  const copyPasswordToClipboard = async () => {
    if (generatedPair) {
      await navigator.clipboard.writeText(generatedPair.password);
      toast.success("Password copied!");
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

  const strength = generatedPair ? getPasswordStrength(generatedPair.password) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generate Both</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Uses your saved preferences
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border dark:border-gray-700">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Generate Username & Password Together
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Create a matching username and secure password pair instantly using your saved preferences.
          </p>
          
          <button
            onClick={handleGenerateBoth}
            disabled={isGenerating}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
          >
            {isGenerating ? "Generating..." : "🚀 Generate Both"}
          </button>
        </div>
      </div>

      {generatedPair && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Generated Credentials</h3>
            <button
              onClick={copyBothToClipboard}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors dark:text-gray-300"
            >
              📋 Copy Both
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username Card */}
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">👤</span>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Username</h4>
                </div>
                <button
                  onClick={copyUsernameToClipboard}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs transition-colors dark:text-gray-300"
                >
                  Copy
                </button>
              </div>
              <div className="font-mono text-lg break-all bg-gray-50 dark:bg-gray-900 p-3 rounded border dark:border-gray-600 dark:text-gray-200">
                {generatedPair.username}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Length: {generatedPair.username.length} characters
              </div>
            </div>

            {/* Password Card */}
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🔒</span>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Password</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs transition-colors dark:text-gray-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={copyPasswordToClipboard}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs transition-colors dark:text-gray-300"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="font-mono text-lg break-all bg-gray-50 dark:bg-gray-900 p-3 rounded border dark:border-gray-600 dark:text-gray-200">
                {showPassword ? generatedPair.password : "•".repeat(generatedPair.password.length)}
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Length: {generatedPair.password.length} characters
                </span>
                {strength && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${strength.bg} ${strength.color}`}>
                    {strength.level}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-lg">💡</span>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-1">Pro Tips</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Both credentials are saved to your history</li>
                  <li>• Customize preferences in individual generators</li>
                  <li>• Use "Copy Both" for formatted text</li>
                  <li>• Settings auto-save as you make changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
