import {BlurView} from 'expo-blur';
import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Extrapolate} from 'react-native-reanimated';
import {interpolate} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  title: string;
}>;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Wrapper: React.FC<Props> = ({children, title}) => {
  const insets = useSafeAreaInsets();
  const scrollYOffset = useSharedValue(1);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      console.log(event.contentOffset.y);
      scrollYOffset.value = event.contentOffset.y;
    },
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollYOffset.value,
            [0, 10],
            [1, 0.5],
            Extrapolate.CLAMP,
          ),
        },
        {
          translateX: interpolate(
            scrollYOffset.value,
            [0, 10],
            [0, -10],
            Extrapolate.CLAMP,
          ),
        },
      ],
      opacity: interpolate(
        scrollYOffset.value,
        [0, 10],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      paddingTop: insets.top,
    };
  });

  const blurAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: insets.top * 2,
      opacity: interpolate(
        scrollYOffset.value,
        [10, 30],
        [0, 1],
        Extrapolate.CLAMP,
      ),
    };
  });

  return (
    <View className="flex-1 bg-white">
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={{paddingTop: insets.top * 2}}
      >
        <View className="flex-1">{children}</View>
      </Animated.ScrollView>
      <Animated.Text
        className="absolute top-0 left-0 bg-red-200 font-semiBold pl-4 text-5xl"
        style={titleAnimatedStyle}
      >
        {title}
      </Animated.Text>
      <AnimatedBlurView
        tint="light"
        intensity={10}
        className="top-0 left-0 right-0 absolute justify-end items-center"
        style={blurAnimatedStyle}
      >
        <Animated.Text className="font-semiBold text-5xl">
          {title}
        </Animated.Text>
      </AnimatedBlurView>
    </View>
  );
};

export default Wrapper;
