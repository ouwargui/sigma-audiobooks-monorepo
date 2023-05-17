import React, {PropsWithChildren, useEffect, useState} from 'react';
import * as ExpoUpdates from 'expo-updates';
import {Alert} from 'react-native';

type UpdateContextType = {
  finishedUpdating: boolean;
};

export const UpdateContext = React.createContext<UpdateContextType>(
  {} as UpdateContextType,
);

const UpdateProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [finishedUpdating, setFinishedUpdating] = useState(false);

  const fetchUpdates = async () => {
    try {
      const update = await ExpoUpdates.checkForUpdateAsync();

      if (update.isAvailable) {
        await ExpoUpdates.fetchUpdateAsync();
        await ExpoUpdates.reloadAsync();
      }
      setFinishedUpdating(true);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update the app. Please try again later.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFinishedUpdating(true);
            },
          },
        ],
      );
    }
  };

  useEffect(() => {
    void fetchUpdates();
  }, []);

  const returnValues = {
    finishedUpdating,
  };

  return (
    <UpdateContext.Provider value={returnValues}>
      {children}
    </UpdateContext.Provider>
  );
};

export default UpdateProvider;
