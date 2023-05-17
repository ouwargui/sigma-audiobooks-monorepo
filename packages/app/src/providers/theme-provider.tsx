import {StatusBar} from 'expo-status-bar';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Appearance} from 'react-native';

type ThemeContextType = {
  isDarkMode: boolean;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  isDarkMode: Appearance.getColorScheme() === 'dark',
});

const ThemeProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();

    setIsDarkMode(colorScheme === 'dark');
  }, []);

  useEffect(() => {
    const unsub = Appearance.addChangeListener((pref) => {
      setIsDarkMode(pref.colorScheme === 'dark');
    });

    return () => unsub.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{isDarkMode}}>
      {children}
      <StatusBar animated style="auto" />
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
