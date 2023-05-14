import {useContext} from 'react';
import {ThemeContext} from '../providers/theme-provider';

export const useColorScheme = () => useContext(ThemeContext);
