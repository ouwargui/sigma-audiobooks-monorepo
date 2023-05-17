import {useContext} from 'react';
import {UpdateContext} from '../providers/update-provider';

export const useUpdates = () => useContext(UpdateContext);
