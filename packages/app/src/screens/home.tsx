import React, {useRef} from 'react';
import {FlatList, ImageBackground, Text, View} from 'react-native';
import {BlurView} from 'expo-blur';
import Wrapper from '../components/wrapper';
import ScalableButton from '../components/scalable-button';
import {Ionicons} from '@expo/vector-icons';
import {trpc} from '../utils/trpc';
import {HomeNavProps} from '../routes/types';
import BookCoverArt from '../components/book-cover-art';
import {useColorScheme} from '../hooks/useColorScheme';
import Animated from 'react-native-reanimated';

const Home: React.FC<HomeNavProps> = ({navigation}) => {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const {isDarkMode} = useColorScheme();
  const discoverBooks = trpc.books.getRecommendations.useQuery();
  const {data: trendingBook} = trpc.books.getTrendingBook.useQuery();

  if (!discoverBooks.data && discoverBooks.isLoading) {
    return null;
  }

  return (
    <Wrapper title="Books" scrollRef={scrollRef}>
      <View style={{gap: 5}}>
        <Text className="ml-4 font-semi text-zinc-500 dark:text-zinc-400">
          Discover
        </Text>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 16}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={discoverBooks.data}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={({item}) => (
            <ScalableButton
              key={item.id}
              scaleTo={0.95}
              onPress={() => navigation.navigate('Book', item)}
            >
              <View className="w-36">
                <BookCoverArt coverArtUrl={item.coverArtUrl} />
              </View>
            </ScalableButton>
          )}
        />
      </View>
      <View className="h-4" />
      <View style={{gap: 5}}>
        <Text className="ml-4 font-semi text-zinc-500 dark:text-zinc-400">
          Trending
        </Text>
        <ScalableButton
          className="flex-1"
          scaleTo={0.95}
          onPress={() => {
            if (!trendingBook) return;
            navigation.navigate('Book', trendingBook);
          }}
        >
          <View className="mx-4 p-4 flex-1 flex-row rounded-xl overflow-hidden">
            <ImageBackground
              className="absolute top-0 left-0 right-0 bottom-0"
              resizeMode="repeat"
              source={{uri: trendingBook?.coverArtUrl}}
            >
              <BlurView className="w-full h-full" tint="dark" intensity={25} />
            </ImageBackground>
            <View className="flex-1" style={{gap: 20}}>
              <View style={{gap: -5}}>
                <Text className="font-semi text-lg text-zinc-50 leading-5">
                  {trendingBook?.title}
                </Text>
                <Text className="font-semi text-zinc-300">Now reading: 1K</Text>
              </View>
              <View style={{gap: -5}}>
                <Text className="font-semi text-zinc-300">44K</Text>
                <Text className="font-semi text-zinc-300">Reviews</Text>
              </View>
            </View>
          </View>
        </ScalableButton>
      </View>
      <View className="h-4" />
      <View className="mx-4 flex-1" style={{gap: 5}}>
        <Text className="font-semi text-zinc-500 dark:text-zinc-400">
          Continue listening
        </Text>
        <View className="h-[1] bg-zinc-400 dark:bg-zinc-600" />
        {discoverBooks.data?.map((book) => (
          <React.Fragment key={book.id}>
            <View className="p-1 flex-row flex-1 justify-between items-center">
              <View className="flex-1">
                <Text className="font-semi text-base text-zinc-800 dark:text-zinc-100">
                  {book.title}
                </Text>
              </View>
              <ScalableButton
                scaleTo={0.95}
                onPress={() => console.log('continue')}
              >
                <View className="rounded-full flex-row border-2 p-1 border-zinc-800 dark:border-zinc-300 justify-between items-center">
                  <Ionicons
                    name="play-circle-outline"
                    size={28}
                    color={isDarkMode ? '#fafafa' : '#27272a'}
                  />
                  <Text className="font-semi text-base text-zinc-800 dark:text-zinc-100">
                    {`${Math.ceil(Math.random() * 24)}`.padStart(2, '0')}:
                    {`${Math.ceil(Math.random() * 59)}`.padStart(2, '0')}
                  </Text>
                </View>
              </ScalableButton>
            </View>
            <View className="h-[1] bg-zinc-400 dark:bg-zinc-600" />
          </React.Fragment>
        ))}
      </View>
    </Wrapper>
  );
};

export default Home;
