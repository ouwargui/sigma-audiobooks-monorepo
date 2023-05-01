import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {httpBatchLink} from '@trpc/react-query';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {trpc} from './utils/trpc';
import {
  useFonts,
  RedHatMono_300Light,
  RedHatMono_400Regular,
  RedHatMono_500Medium,
  RedHatMono_600SemiBold,
  RedHatMono_700Bold,
  RedHatMono_300Light_Italic,
  RedHatMono_400Regular_Italic,
  RedHatMono_500Medium_Italic,
  RedHatMono_600SemiBold_Italic,
  RedHatMono_700Bold_Italic,
} from '@expo-google-fonts/red-hat-mono';
import Router from './routes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {setupPlayer} from './services/PlaybackService';
import PlayerProvider from './providers/player.provider';

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'https://audiobooks.guisantos.dev/api/trpc',
    }),
  ],
});
const queryClient = new QueryClient();

void setupPlayer();

const App: React.FC = () => {
  const [fontsLoaded, error] = useFonts({
    RedHatMono_300Light,
    RedHatMono_400Regular,
    RedHatMono_500Medium,
    RedHatMono_600SemiBold,
    RedHatMono_700Bold,
    RedHatMono_300Light_Italic,
    RedHatMono_400Regular_Italic,
    RedHatMono_500Medium_Italic,
    RedHatMono_600SemiBold_Italic,
    RedHatMono_700Bold_Italic,
  });

  if (!fontsLoaded) {
    if (error) {
      console.error(error.message);
    }
    return null;
  }

  return (
    <PlayerProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{flex: 1}}>
            <Router />
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </QueryClientProvider>
      </trpc.Provider>
    </PlayerProvider>
  );
};

export default App;
