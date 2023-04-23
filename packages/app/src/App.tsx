import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'expo-status-bar';
import {httpBatchLink} from '@trpc/react-query';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {trpc} from './utils/trpc';
import TabRoutes from './routes/tab.routes';
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

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
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
        <NavigationContainer>
          <TabRoutes />
        </NavigationContainer>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
