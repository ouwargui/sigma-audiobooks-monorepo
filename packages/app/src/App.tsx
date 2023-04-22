import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {AppRouter} from '@sigma-audiobooks/shared';
import {createTRPCReact, httpBatchLink} from '@trpc/react-query';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const trpc = createTRPCReact<AppRouter>();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});
const queryClient = new QueryClient();

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
          <Teste />
          <StatusBar style="auto" />
        </View>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Teste() {
  const userListQuery = trpc.userList.useQuery();
  const userByIdQuery = trpc.userById.useQuery('1');

  return (
    <View>
      {userListQuery.data?.map((user) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
      <Text>{userByIdQuery.data?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
