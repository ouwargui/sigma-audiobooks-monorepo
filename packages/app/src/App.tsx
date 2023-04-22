import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {Text, View} from 'react-native';
import {httpBatchLink} from '@trpc/react-query';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {trpc} from './utils/trpc';

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
        <View className="flex-1 bg-white items-center justify-center">
          <Text>Open up App.tsx to start working on your app!</Text>
          <Teste />
          <StatusBar style="auto" />
        </View>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Teste() {
  const userListQuery = trpc.books.getAll.useQuery();
  const userByIdQuery = trpc.reviews.getById.useQuery(1);

  return (
    <View>
      {userListQuery.data?.map((user) => (
        <Text key={user.id}>{user.author}</Text>
      ))}
      <Text>{userByIdQuery.data?.title}</Text>
    </View>
  );
}
