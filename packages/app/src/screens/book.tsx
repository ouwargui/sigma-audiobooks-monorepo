import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {BookNavProps} from '../routes/types';
import BookCoverArt from '../components/book-cover-art';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import ScalableButton from '../components/scalable-button';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Book: React.FC<BookNavProps> = ({route}) => {
  const book = route.params;
  const insets = useSafeAreaInsets();
  const [scrollYOffset, setScrollYOfsset] = useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      runOnJS(setScrollYOfsset)(
        interpolate(event.contentOffset.y, [0, 50], [0, 40], 'clamp'),
      );
    },
  });

  const animatedBorder = useAnimatedStyle(() => {
    return {
      borderBottomColor: interpolateColor(
        scrollYOffset,
        [0, 50],
        ['#fff', '#E4E4E7'],
      ),
      borderBottomWidth: 1,
    };
  });

  return (
    <View className="flex-1 bg-white">
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top + 46,
          paddingBottom: insets.bottom,
        }}
      >
        <View className="flex-1">
          <View className="justify-center items-center" style={{gap: 10}}>
            <BookCoverArt coverArtUrl={book.coverArtUrl} />
            <View
              style={{gap: 5}}
              className="border-[1px] border-zinc-500 p-1 flex-row rounded-full justify-between items-center"
            >
              <View className="w-2 h-2 bg-blue-700 rounded-full"></View>
              <View className="w-2 h-2 bg-zinc-500 rounded-full"></View>
            </View>
          </View>
          <View className="h-4" />
          <View
            className="mx-4 items-center flex-row flex-wrap"
            style={{gap: 4}}
          >
            {book.tags.map((tag, idx) => (
              <View
                key={idx}
                className="justify-between items-center rounded-full border-[1px] border-zinc-700 p-2"
              >
                <Text className="font-medium text-zinc-800 text-base capitalize">
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
          <View className="h-4" />
          <View className="flex-row mx-4">
            <View className="flex-1 justify-center">
              <Text className="font-semi text-2xl text-zinc-800">
                {book.title}
              </Text>
              <Text className="font-regular text-base text-zinc-500">
                {book.author}
              </Text>
            </View>
            <View style={{gap: 5}} className="flex-row-reverse justify-start">
              <View className="justify-between">
                <ScalableButton onPress={() => console.log('rate')}>
                  <View
                    className="flex-row rounded-md items-center justify-center bg-blue-600 py-2 px-3"
                    style={{gap: 5}}
                  >
                    <Ionicons name="star-outline" size={20} color="white" />
                    <Text className="text-white font-bold text-base">4,45</Text>
                  </View>
                </ScalableButton>
                <View style={{gap: -5}}>
                  <Text className="font-regular text-base text-zinc-500">
                    100K
                  </Text>
                  <Text className="font-regular text-base text-zinc-500">
                    Reviews
                  </Text>
                </View>
              </View>
              <View className="h-full w-[1px] bg-zinc-300" />
            </View>
          </View>
          <View className="h-4" />
          <View className="mx-4">
            <Text className="font-medium text-base text-justify text-zinc-800">
              {book.description}
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
      <AnimatedBlurView
        className="absolute left-0 top-0 right-0 flex-row justify-between px-4 pb-4"
        tint="light"
        intensity={scrollYOffset}
        style={[{paddingTop: insets.top}, animatedBorder]}
      >
        <Ionicons name="chevron-back" size={24} color="#3f3f46" />
        <Ionicons name="send-outline" size={24} color="#3f3f46" />
      </AnimatedBlurView>
    </View>
  );
};

export default Book;
