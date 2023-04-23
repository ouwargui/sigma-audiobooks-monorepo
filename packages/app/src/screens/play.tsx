import React from 'react';
import {View, Text, SafeAreaView, useWindowDimensions} from 'react-native';
import BookCoverArt from '../components/book-cover-art';
import {PlayNavProps} from '../routes/types';
import {Ionicons} from '@expo/vector-icons';
import ScalableButton from '../components/scalable-button';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const Play: React.FC<PlayNavProps> = ({route}) => {
  const book = route.params;
  const previousSliderOffsetX = useSharedValue(0);
  const sliderOffsetX = useSharedValue(0);
  const isKnobActive = useSharedValue(false);
  const {width} = useWindowDimensions();

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      previousSliderOffsetX.value = sliderOffsetX.value;
      isKnobActive.value = true;
    })
    .onUpdate((e) => {
      const sliderSize = width - 32 * 2;
      const value =
        previousSliderOffsetX.value + (e.translationX / sliderSize) * 100;
      sliderOffsetX.value = interpolate(value, [0, 100], [0, 100], 'clamp');
    })
    .onEnd(() => {
      isKnobActive.value = false;
    });

  const sliderAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${sliderOffsetX.value}%`,
    };
  });

  const knobAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isKnobActive.value
            ? withTiming(2, {duration: 200})
            : withTiming(1, {duration: 200}),
        },
        {
          translateX: 8,
        },
      ],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-44 self-center mt-4">
        <BookCoverArt coverArtUrl={book.coverArtUrl} />
        <View className="h-4" />
        <View className="flex-row justify-between items-center px-3">
          <ScalableButton onPress={() => console.log('bookmark')}>
            <Ionicons name="bookmark-outline" size={24} color="#71717a" />
          </ScalableButton>
          <ScalableButton onPress={() => console.log('time')}>
            <Text className="font-regular text-xl text-zinc-500">1x</Text>
          </ScalableButton>
          <ScalableButton onPress={() => console.log('ellipsis')}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#71717a" />
          </ScalableButton>
        </View>
      </View>
      <View className="h-6" />
      <View className="flex-row mx-8 items-center justify-between">
        <View className="flex-1" style={{gap: -5}}>
          <Text className="font-semi text-2xl text-zinc-800">{book.title}</Text>
          <Text className="font-regular text-base text-zinc-500">
            {book.author}
          </Text>
        </View>
        <ScalableButton onPress={() => console.log('rate')}>
          <Ionicons name="star-outline" size={24} color="#71717a" />
        </ScalableButton>
      </View>
      <View className="h-4" />
      <View className="mx-8 flex-1">
        <GestureDetector gesture={dragGesture}>
          <Animated.View className="h-2 bg-zinc-300 rounded-full justify-start">
            <Animated.View
              style={sliderAnimatedStyle}
              className="absolute h-full bg-blue-700 items-end justify-center rounded-full"
            >
              <Animated.View
                className="w-4 h-4 bg-blue-700 rounded-full"
                style={knobAnimatedStyle}
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
    </SafeAreaView>
  );
};

export default Play;
