import { Toaster } from "sonner";
import { GeneratorApp } from "./GeneratorApp";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { useDarkMode } from "./hooks/useDarkMode";

export default function App() {
  const { isDark } = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-16 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary dark:text-blue-400">
          🔐 Advanced Password & Username Generator
        </h2>
        <DarkModeToggle />
      </header>
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <GeneratorApp />
        </div>
      </main>
      <Toaster theme={isDark ? 'dark' : 'light'} />
    </div>
  );
}
