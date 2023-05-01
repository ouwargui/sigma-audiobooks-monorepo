import React, {PropsWithChildren, useState} from 'react';
import {BlurView} from 'expo-blur';
import {View, Text} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  title: string;
}>;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Wrapper: React.FC<Props> = ({children, title}) => {
  const insets = useSafeAreaInsets();
  const [scrollYOffset, setScrollYOffset] = useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      const value = interpolate(
        event.contentOffset.y,
        [0, 50],
        [0, 40],
        'clamp',
      );

      runOnJS(setScrollYOffset)(value);
    },
  });

  const animatedBorder = useAnimatedStyle(() => {
    return {
      borderBottomColor: interpolateColor(
        scrollYOffset,
        [0, 50],
        ['#fff', '#a1a1aa'],
      ),
      borderBottomWidth: 0.5,
    };
  });

  return (
    <View className="flex-1 bg-white">
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top < 30 ? 80 : insets.top * 2,
        }}
      >
        <View className="flex-1">{children}</View>
      </Animated.ScrollView>
      <AnimatedBlurView
        intensity={scrollYOffset}
        tint="light"
        className="top-0 left-0 right-0 absolute justify-end items-start"
        style={[
          {height: insets.top < 30 ? 80 : insets.top * 2},
          animatedBorder,
        ]}
      >
        <Text className="font-semi pl-3 text-5xl text-zinc-800">{title}</Text>
      </AnimatedBlurView>
    </View>
  );
};

export default Wrapper;
