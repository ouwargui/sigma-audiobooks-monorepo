import {useEffect, useState} from 'react';
import {Appearance} from 'react-native';

const useColorScheme = () => {
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

  return [isDarkMode];
};

export {useColorScheme};
