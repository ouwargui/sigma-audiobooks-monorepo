import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, SafeAreaView, useWindowDimensions} from 'react-native';
import BookCoverArt from '../components/book-cover-art';
import {PlayNavProps} from '../routes/types';
import {Ionicons} from '@expo/vector-icons';
import ScalableButton from '../components/scalable-button';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {convertMsToTime} from '../utils/time-format';
import {usePlayer} from '../hooks/usePlayer';
import {useColorScheme} from '../hooks/useColorScheme';

const VOLUME_SLIDER_SIZE = 240;
const VOLUME_INTERVAL = 100;

type Intervals = {
  volumeUpInterval?: NodeJS.Timer;
  volumeDownInterval?: NodeJS.Timer;
};

const Play: React.FC<PlayNavProps> = ({navigation, route}) => {
  const params = route.params;
  const {isDarkMode} = useColorScheme();
  const disabledColor = isDarkMode ? '#4c4c30' : '#d4d4d8';
  const trackControlIconColor = isDarkMode ? '#f4f4f5' : '#18181b';
  const previousSliderOffsetX = useSharedValue(0);
  const isKnobActive = useSharedValue(false);
  const previousVolumeSliderOffsetX = useSharedValue(0);
  const isVolumeKnobActive = useSharedValue(false);
  const {width} = useWindowDimensions();
  const player = usePlayer();
  const sliderOffsetX = useSharedValue(0);
  const volumeSliderOffsetX = useSharedValue(
    player.currentVolume * VOLUME_SLIDER_SIZE,
  );
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
          runOnJS(player.seekTo)((sliderOffsetX.value / 100) * player.duration);
        }),
    [
      isKnobActive,
      player.seekTo,
      player.duration,
      previousSliderOffsetX,
      sliderOffsetX,
      width,
    ],
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
          volumeSliderOffsetX.value = interpolate(
            value,
            [0, VOLUME_SLIDER_SIZE],
            [0, VOLUME_SLIDER_SIZE],
            'clamp',
          );
          runOnJS(player.setVolume)(
            volumeSliderOffsetX.value / VOLUME_SLIDER_SIZE,
          );
        })
        .onEnd(() => {
          isVolumeKnobActive.value = false;
        }),
    [
      isVolumeKnobActive,
      player,
      previousVolumeSliderOffsetX,
      volumeSliderOffsetX,
    ],
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
    void player.setVolume(newVolume);
    volumeSliderOffsetX.value = withTiming(newVolume * VOLUME_SLIDER_SIZE, {
      duration: 150,
    });
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
    void player.setVolume(newVolume);
    volumeSliderOffsetX.value = withTiming(newVolume * VOLUME_SLIDER_SIZE, {
      duration: 150,
    });
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

  const togglePlayPause = async () => {
    await player.togglePlay();
  };

  const onPressSkipNext = async () => {
    await player.skipToNext();
  };

  const onPressSkipBack = async () => {
    await player.skipToPrevious();
  };

  const toggleRate = async () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentRateIndex = rates.findIndex(
      (rate) => rate === player.currentRate,
    );
    const nextRate = rates[currentRateIndex + 1] ?? rates[0];
    await player.setRate(nextRate);
  };

  useEffect(() => {
    const durationMillis = player.duration * 1000;
    const currentMillis = player.position * 1000;
    const millisPercentage = (currentMillis * 100) / durationMillis;
    sliderOffsetX.value = withTiming(millisPercentage);
  }, [player.duration, player.position, sliderOffsetX]);

  useEffect(() => {
    if (params?.shouldPlay) {
      void player.togglePlay();
    }
  }, [params, player]);

  return (
    <SafeAreaView className="flex-1 bg-light dark:bg-dark">
      <View className="w-44 self-center mt-4">
        <ScalableButton
          scaleTo={0.95}
          onPress={() => {
            if (!player.currentBook) {
              return;
            }
            navigation.navigate('Book', player.currentBook);
          }}
        >
          <BookCoverArt coverArtUrl={player.currentBook?.coverArtUrl ?? ''} />
        </ScalableButton>
        <View className="h-4" />
        <View className="flex-row justify-between items-center px-3">
          <ScalableButton onPress={() => console.log('bookmark')}>
            <Ionicons
              name="bookmark-outline"
              size={24}
              color={isDarkMode ? '#a1a1aa' : '#71717a'}
            />
          </ScalableButton>
          <ScalableButton onPress={() => void toggleRate()}>
            <Text className="font-regular text-xl text-secondary-light dark:text-secondary-dark">
              {player.currentRate}x
            </Text>
          </ScalableButton>
          <ScalableButton onPress={() => console.log('ellipsis')}>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={isDarkMode ? '#a1a1aa' : '#71717a'}
            />
          </ScalableButton>
        </View>
      </View>
      <View className="h-6" />
      <View className="flex-row mx-8 items-center justify-between">
        <View className="flex-1" style={{gap: -5}}>
          <Text className="font-semi text-2xl text-primary-light dark:text-primary-dark">
            {player.currentBook?.title}
          </Text>
          <Text className="font-regular text-base text-secondary-light dark:text-secondary-dark">
            {player.currentBook?.author}
          </Text>
        </View>
        <ScalableButton onPress={() => console.log('rate')}>
          <Ionicons
            name="star-outline"
            size={24}
            color={isDarkMode ? '#a1a1aa' : '#71717a'}
          />
        </ScalableButton>
      </View>
      <View className="h-4" />
      <View className="px-8 py-2 w-full">
        <GestureDetector gesture={trackingDragGesture}>
          <Animated.View
            hitSlop={{top: 20, bottom: 20}}
            className="h-2 bg-contrast-light dark:bg-contrast-dark rounded-full justify-start"
          >
            <Animated.View
              style={sliderAnimatedStyle}
              className="absolute h-full bg-blue-light dark:bg-blue-dark items-end justify-center rounded-full"
            >
              <Animated.View
                className="w-4 h-4 bg-blue-light dark:bg-blue-dark rounded-full"
                style={knobAnimatedStyle}
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
      <View className="flex-row px-8 justify-between w-full">
        <Text className="font-regular text-sm text-secondary-light dark:text-secondary-dark">
          {convertMsToTime(player.position * 1000)}
        </Text>
        <Text className="font-regular text-sm text-secondary-light dark:text-secondary-dark">
          Chapter {player.currentChapter}/{player.currentBook?.totalChapters}
        </Text>
        <Text className="font-regular text-sm text-secondary-light dark:text-secondary-dark">
          {convertMsToTime(player.duration * 1000)}
        </Text>
      </View>
      <View className="h-10" />
      <View className="flex-row mx-8 items-center justify-between">
        <ScalableButton
          disabled={player.currentChapter - 1 < 1 && player.position <= 3}
          onPress={() => void onPressSkipBack()}
        >
          <Ionicons
            name="play-skip-back-outline"
            size={30}
            color={
              player.currentChapter - 1 < 1 && player.position <= 3
                ? disabledColor
                : trackControlIconColor
            }
          />
        </ScalableButton>
        <ScalableButton onPress={() => void togglePlayPause()}>
          <Ionicons
            name={player.isPlaying ? 'pause' : 'play'}
            size={50}
            color={
              (player.currentBook?.totalChapters ?? 0) <
              player.currentChapter + 1
                ? disabledColor
                : trackControlIconColor
            }
          />
        </ScalableButton>
        <ScalableButton
          disabled={
            (player.currentBook?.totalChapters ?? 0) < player.currentChapter + 1
          }
          onPress={() => void onPressSkipNext()}
        >
          <Ionicons
            name="play-skip-forward-outline"
            size={30}
            color={
              (player.currentBook?.totalChapters ?? 0) <
              player.currentChapter + 1
                ? disabledColor
                : trackControlIconColor
            }
          />
        </ScalableButton>
      </View>
      <View className="flex-1 flex-row justify-between items-center mx-8">
        <ScalableButton
          onLongPress={longPressVolumeDown}
          onPressOut={onPressOutVolumeDown}
          onPress={onPressVolumeDown}
        >
          <Ionicons
            name="volume-off-outline"
            size={24}
            color={isDarkMode ? '#a1a1aa' : '#71717a'}
          />
        </ScalableButton>
        <GestureDetector gesture={volumeDragGesture}>
          <Animated.View
            hitSlop={{top: 20, bottom: 20}}
            className="w-60 bg-placeholder dark:bg-placeholder-dark h-1 mx-4 rounded-full"
          >
            <Animated.View
              style={volumeSliderAnimatedStyle}
              className="absolute h-full bg-contrast-dark dark:bg-contrast-light items-end justify-center rounded-full"
            >
              <Animated.View
                style={volumeKnobAnimatedStyle}
                className="w-4 h-4 bg-contrast-dark dark:bg-contrast-light rounded-full"
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
        <ScalableButton
          onLongPress={longPressVolumeUp}
          onPressOut={onPressOutVolumeUp}
          onPress={onPressVolumeUp}
        >
          <Ionicons
            name="volume-low-outline"
            size={24}
            color={isDarkMode ? '#a1a1aa' : '#71717a'}
          />
        </ScalableButton>
      </View>
    </SafeAreaView>
  );
};

export default Play;
