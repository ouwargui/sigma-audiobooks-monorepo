import React, {PropsWithChildren, useState} from 'react';
import * as ExpoUpdates from 'expo-updates';
import {Alert} from 'react-native';

type UpdateContextType = {
  finishedCheckingForUpdate: boolean;
  updateAvailable: boolean;
};

export const UpdateContext = React.createContext<UpdateContextType>(
  {} as UpdateContextType,
);

const UpdateProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [finishedCheckingForUpdate, setFinishedCheckingForUpdate] =
    useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const updatesListener = (event: ExpoUpdates.UpdateEvent) => {
    if (event.type === ExpoUpdates.UpdateEventType.NO_UPDATE_AVAILABLE) {
      setFinishedCheckingForUpdate(true);
      setUpdateAvailable(false);
      return;
    }

    if (event.type === ExpoUpdates.UpdateEventType.UPDATE_AVAILABLE) {
      setFinishedCheckingForUpdate(true);
      setUpdateAvailable(true);
      return Alert.alert('Update available', 'Do you want to update now?', [
        {
          text: 'Yes',
          onPress: () => void ExpoUpdates.reloadAsync(),
          isPreferred: true,
        },
        {text: 'No', style: 'cancel'},
      ]);
    }

    if (event.type === ExpoUpdates.UpdateEventType.ERROR) {
      setFinishedCheckingForUpdate(true);
      setUpdateAvailable(false);
      console.error(event.message);
      return;
    }
  };

  ExpoUpdates.useUpdateEvents(updatesListener);

  const returnValues: UpdateContextType = {
    finishedCheckingForUpdate,
    updateAvailable,
  };

  return (
    <UpdateContext.Provider value={returnValues}>
      {children}
    </UpdateContext.Provider>
  );
};

export default UpdateProvider;
