import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useDarkMode() {
  const userPreferences = useQuery(api.generator.getUserPreferences);
  const savePreferences = useMutation(api.generator.saveUserPreferences);
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (userPreferences?.darkMode !== undefined) {
      setIsDark(userPreferences.darkMode);
    }
  }, [userPreferences]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    
    // Save to user preferences if they exist
    if (userPreferences) {
      try {
        await savePreferences({
          ...userPreferences,
          darkMode: newMode,
        });
      } catch (error) {
        console.error('Failed to save dark mode preference:', error);
      }
    }
  };

  return { isDark, toggleDarkMode };
}
