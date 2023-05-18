import React, {PropsWithChildren, useEffect, useState} from 'react';
import * as ExpoUpdates from 'expo-updates';
import {Alert} from 'react-native';

type UpdateContextType = {
  finishedUpdating: boolean;
  isDeepLinking: boolean;
  setIsDeepLinking: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UpdateContext = React.createContext<UpdateContextType>(
  {} as UpdateContextType,
);

const UpdateProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [finishedUpdating, setFinishedUpdating] = useState(false);
  const [isDeepLinking, setIsDeepLinking] = useState(false);

  const fetchUpdates = async () => {
    try {
      if (__DEV__) {
        return setFinishedUpdating(true);
      }

      const update = await ExpoUpdates.checkForUpdateAsync();

      if (update.isAvailable) {
        const fetchedUpdate = await ExpoUpdates.fetchUpdateAsync();
        if (fetchedUpdate.isNew) {
          await ExpoUpdates.reloadAsync();
        }
      }
      setFinishedUpdating(true);
    } catch (error) {
      const err = error as Error;
      Alert.alert(
        'Error',
        `Failed to update the app. Please try again later.\nDetails: ${err.message}`,
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

  const returnValues: UpdateContextType = {
    finishedUpdating,
    isDeepLinking,
    setIsDeepLinking,
  };

  return (
    <UpdateContext.Provider value={returnValues}>
      {children}
    </UpdateContext.Provider>
  );
};

export default UpdateProvider;
