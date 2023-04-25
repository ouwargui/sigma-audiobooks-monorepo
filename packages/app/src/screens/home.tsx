import React from 'react';
import {FlatList, Text, View} from 'react-native';
import Wrapper from '../components/wrapper';
import ScalableButton from '../components/scalable-button';
import {Ionicons} from '@expo/vector-icons';
import {trpc} from '../utils/trpc';
import {HomeNavProps} from '../routes/types';
import BookCoverArt from '../components/book-cover-art';

const Home: React.FC<HomeNavProps> = ({navigation}) => {
  const discoverBooks = trpc.books.getRecommendations.useQuery();
  const {data: trendingBook} = trpc.books.getTrendingBook.useQuery();

  if (!discoverBooks.data && discoverBooks.isLoading) {
    return null;
  }

  return (
    <Wrapper title="Books">
      <View style={{gap: 5}}>
        <Text className="ml-4 font-semi text-zinc-500">Discover</Text>
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
        <Text className="ml-4 font-semi text-zinc-500">Trending</Text>
        <ScalableButton
          style={{flex: 1}}
          scaleTo={0.95}
          onPress={() => {
            if (!trendingBook) return;
            navigation.navigate('Book', trendingBook);
          }}
        >
          <View className="mx-4 p-4 flex-1 border-2 border-zinc-500 flex-row rounded-xl overflow-hidden">
            <View className="flex-1" style={{gap: 20}}>
              <View style={{gap: -5}}>
                <Text className="font-semi text-lg text-zinc-800 leading-5">
                  {trendingBook?.title}
                </Text>
                <Text className="font-semi text-zinc-500">Now reading: 1K</Text>
              </View>
              <View style={{gap: -5}}>
                <Text className="font-semi text-zinc-500">44K</Text>
                <Text className="font-semi text-zinc-500">Reviews</Text>
              </View>
            </View>
            <View className="flex-1 bg-red-200" />
          </View>
        </ScalableButton>
      </View>
      <View className="h-4" />
      <View className="mx-4 flex-1" style={{gap: 5}}>
        <Text className="font-semi text-zinc-500">Continue listening</Text>
        <View className="h-[1] bg-zinc-400" />
        {discoverBooks.data?.map((book) => (
          <React.Fragment key={book.id}>
            <View className="p-1 flex-row flex-1 justify-between items-center">
              <View className="flex-1">
                <Text className="font-semi text-base text-zinc-800">
                  {book.title}
                </Text>
              </View>
              <ScalableButton
                scaleTo={0.95}
                onPress={() => console.log('continue')}
              >
                <View className="rounded-full flex-row border-2 p-1 border-zinc-800 justify-between items-center">
                  <Ionicons
                    name="play-circle-outline"
                    size={28}
                    className="bg-zinc-800"
                  />
                  <Text className="font-semi text-base text-zinc-800">
                    {`${Math.ceil(Math.random() * 24)}`.padStart(2, '0')}:
                    {`${Math.ceil(Math.random() * 59)}`.padStart(2, '0')}
                  </Text>
                </View>
              </ScalableButton>
            </View>
            <View className="h-[1] bg-zinc-400" />
          </React.Fragment>
        ))}
      </View>
    </Wrapper>
  );
};

export default Home;
