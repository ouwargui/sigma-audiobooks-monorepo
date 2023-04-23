import React from 'react';
import {FlatList, Text, View} from 'react-native';
import Wrapper from '../components/wrapper';
import ScalableButton from '../components/scalable-button';

const Home: React.FC = () => {
  return (
    <Wrapper title="Books">
      <View style={{gap: 5}}>
        <Text className="ml-4 font-semi text-zinc-500">Discover</Text>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 16}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={Array(10).fill(1)}
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={() => (
            <ScalableButton scaleTo={0.95} onPress={() => {}}>
              <View className="bg-red-200 w-36 aspect-[9/16] rounded-lg"></View>
            </ScalableButton>
          )}
        />
      </View>
      <View className="h-4" />
      <View style={{gap: 5}}>
        <Text className="ml-4 font-semi text-zinc-500">Trending</Text>
        <ScalableButton scaleTo={0.95} onPress={() => {}}>
          <View className="mx-4 p-4 flex-1 border-2 border-zinc-500 flex-row rounded-xl overflow-hidden">
            <View style={{gap: 20}}>
              <View style={{gap: -5}}>
                <Text className="font-semi text-lg text-zinc-800">
                  Fight Club
                </Text>
                <Text className="font-semi text-zinc-500">
                  Now reading: 1,920
                </Text>
              </View>
              <View style={{gap: -5}}>
                <Text className="font-semi text-zinc-500">44K</Text>
                <Text className="font-semi text-zinc-500">Reviews</Text>
              </View>
            </View>
            <View className="w-full h-full bg-red-200" />
          </View>
        </ScalableButton>
      </View>
      <View className="h-4" />
      <View style={{gap: 5}}>
        <Text className="ml-4 font-semi text-zinc-500">Continue listening</Text>
      </View>
    </Wrapper>
  );
};

export default Home;
