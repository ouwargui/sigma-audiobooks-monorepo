import React, {PropsWithChildren, useState} from 'react';
import * as ExpoUpdates from 'expo-updates';

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
      return;
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
