import React, {useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {Button, Text, View} from 'react-native';
import {httpBatchLink} from '@trpc/react-query';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {trpc} from './utils/trpc';
import {Audio} from 'expo-av';

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
          <AudioPlayer />
          <StatusBar style="auto" />
        </View>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const uri =
  'https://d19manr6rwgxys.cloudfront.net/books/alice/aliceinwonderland_00_carroll_64kb.mp3';
const uri2 =
  'https://d19manr6rwgxys.cloudfront.net/books/alice/aliceinwonderland_01_carroll_64kb.mp3';

function AudioPlayer() {
  const [audio, setAudio] = useState<Audio.Sound>();
  const book = trpc.books.getById.useQuery(1);

  const playSound = async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    console.log('Loading Sound');
    const {sound, status} = await Audio.Sound.createAsync({uri});
    setAudio(sound);

    if (status.isLoaded) {
      setAudio(sound);
      await sound.playAsync();
    }
  };

  const playNext = async () => {
    await audio?.stopAsync();
    await audio?.unloadAsync();
    const {sound, status} = await Audio.Sound.createAsync({uri: uri2});

    if (status.isLoaded) {
      setAudio(sound);
      await sound.playAsync();
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="bg-red-200">{book.data?.title}</Text>
      <Button
        title="Play"
        onPress={(e) => {
          void playSound();
        }}
      />
      <Button
        title="Next"
        onPress={(e) => {
          void playNext();
        }}
      />
    </View>
  );
}
