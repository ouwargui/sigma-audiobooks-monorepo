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

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://192.168.15.119:3000/api/trpc',
    }),
  ],
});
const queryClient = new QueryClient();

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
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <StatusBar style="auto" />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
