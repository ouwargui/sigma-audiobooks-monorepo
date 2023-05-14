import {useContext} from 'react';
import {PlayerContext} from '../providers/player-provider';

export const usePlayer = () => useContext(PlayerContext);
