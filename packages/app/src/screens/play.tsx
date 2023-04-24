import React, {useMemo, useState} from 'react';
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

const VOLUME_SLIDER_SIZE = 240;
const VOLUME_INTERVAL = 100;

type Intervals = {
  volumeUpInterval?: NodeJS.Timer;
  volumeDownInterval?: NodeJS.Timer;
};

const Play: React.FC<PlayNavProps> = ({route}) => {
  const book = route.params;
  const previousSliderOffsetX = useSharedValue(0);
  const sliderOffsetX = useSharedValue(0);
  const isKnobActive = useSharedValue(false);
  const previousVolumeSliderOffsetX = useSharedValue(0);
  const volumeSliderOffsetX = useSharedValue(0);
  const isVolumeKnobActive = useSharedValue(false);
  const [isBookPlaying, setIsBookPlaying] = useState(false);
  const {width} = useWindowDimensions();
  const [intervals, setIntervals] = useState<Intervals>({});

  const trackingDragGesture = useMemo(
    () =>
      Gesture.Pan()
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
        }),
    [isKnobActive, previousSliderOffsetX, sliderOffsetX, width],
  );

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

  const volumeDragGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          previousVolumeSliderOffsetX.value = volumeSliderOffsetX.value;
          isVolumeKnobActive.value = true;
        })
        .onUpdate((e) => {
          const value = previousVolumeSliderOffsetX.value + e.translationX;
          console.log(value);
          volumeSliderOffsetX.value = interpolate(
            value,
            [0, VOLUME_SLIDER_SIZE],
            [0, VOLUME_SLIDER_SIZE],
            'clamp',
          );
        })
        .onEnd(() => {
          isVolumeKnobActive.value = false;
        }),
    [isVolumeKnobActive, previousVolumeSliderOffsetX, volumeSliderOffsetX],
  );

  const volumeSliderAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: volumeSliderOffsetX.value,
    };
  });

  const volumeKnobAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isVolumeKnobActive.value
            ? withTiming(2, {duration: 200})
            : withTiming(1, {duration: 200}),
        },
        {
          translateX: 4,
        },
      ],
    };
  });

  const onPressVolumeUp = () => {
    const oldVolume = volumeSliderOffsetX.value / VOLUME_SLIDER_SIZE;
    const newVolume = oldVolume + 0.1 > 1 ? 1 : oldVolume + 0.1;
    volumeSliderOffsetX.value = newVolume * VOLUME_SLIDER_SIZE;
  };

  const longPressVolumeUp = () => {
    const longPressInterval = setInterval(() => {
      onPressVolumeUp();
    }, VOLUME_INTERVAL);

    setIntervals((prev) => {
      return {
        ...prev,
        volumeUpInterval: longPressInterval,
      };
    });
  };

  const onPressOutVolumeUp = () => {
    if (intervals.volumeUpInterval) {
      clearInterval(intervals.volumeUpInterval);
    }
  };

  const onPressVolumeDown = () => {
    const oldVolume = volumeSliderOffsetX.value / VOLUME_SLIDER_SIZE;
    const newVolume = oldVolume - 0.1 < 0 ? 0 : oldVolume - 0.1;
    volumeSliderOffsetX.value = newVolume * VOLUME_SLIDER_SIZE;
  };

  const longPressVolumeDown = () => {
    const longPressInterval = setInterval(() => {
      onPressVolumeDown();
    }, VOLUME_INTERVAL);

    setIntervals((prev) => {
      return {
        ...prev,
        volumeDownInterval: longPressInterval,
      };
    });
  };

  const onPressOutVolumeDown = () => {
    if (intervals.volumeDownInterval) {
      clearInterval(intervals.volumeDownInterval);
    }
  };

  const togglePlayBook = () => {
    setIsBookPlaying((prev) => !prev);
  };

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
      <View className="px-8 py-2 w-full">
        <GestureDetector gesture={trackingDragGesture}>
          <Animated.View
            hitSlop={{top: 20, bottom: 20}}
            className="h-2 bg-zinc-300 rounded-full justify-start"
          >
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
      <View className="flex-row mx-8 justify-between">
        <Text className="font-regular text-sm text-zinc-500">1:00:03</Text>
        <Text className="font-regular text-sm text-zinc-500">Chapter 6/29</Text>
        <Text className="font-regular text-sm text-zinc-500">5:14:29</Text>
      </View>
      <View className="h-10" />
      <View className="flex-row mx-8 items-center justify-between">
        <ScalableButton>
          <Ionicons name="play-skip-back-outline" size={30} color="#09090b" />
        </ScalableButton>
        <ScalableButton onPress={togglePlayBook}>
          <Ionicons
            name={isBookPlaying ? 'pause' : 'play'}
            size={50}
            color="#09090b"
          />
        </ScalableButton>
        <ScalableButton>
          <Ionicons
            name="play-skip-forward-outline"
            size={30}
            color="#09090b"
          />
        </ScalableButton>
      </View>
      <View className="flex-1 flex-row justify-between items-center mx-8">
        <ScalableButton
          onLongPress={longPressVolumeDown}
          onPressOut={onPressOutVolumeDown}
          onPress={onPressVolumeDown}
        >
          <Ionicons name="volume-off-outline" size={24} color="#09090b" />
        </ScalableButton>
        <GestureDetector gesture={volumeDragGesture}>
          <Animated.View
            hitSlop={{top: 20, bottom: 20}}
            className="w-60 bg-zinc-200 h-1 mx-4 rounded-full"
          >
            <Animated.View
              style={volumeSliderAnimatedStyle}
              className="absolute h-full bg-zinc-400 items-end justify-center rounded-full"
            >
              <Animated.View
                style={volumeKnobAnimatedStyle}
                className="w-4 h-4 bg-zinc-700 rounded-full"
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
        <ScalableButton
          onLongPress={longPressVolumeUp}
          onPressOut={onPressOutVolumeUp}
          onPress={onPressVolumeUp}
        >
          <Ionicons name="volume-low-outline" size={24} color="#09090b" />
        </ScalableButton>
      </View>
    </SafeAreaView>
  );
};

export default Play;
