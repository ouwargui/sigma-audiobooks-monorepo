import {BlurView} from 'expo-blur';
import React, {PropsWithChildren} from 'react';
import {View, Text} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  title: string;
}>;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Wrapper: React.FC<Props> = ({children, title}) => {
  const insets = useSafeAreaInsets();
  const scrollYOffset = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scrollYOffset.value = withTiming(
        interpolate(event.contentOffset.y, [0, 50], [0, 40], 'clamp'),
      );
      console.log(scrollYOffset.value);
    },
  });

  return (
    <View className="flex-1 bg-white">
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingTop: insets.top * 2}}
      >
        <View className="flex-1">{children}</View>
      </Animated.ScrollView>
      <AnimatedBlurView
        animatedProps={{intensity: scrollYOffset.value}}
        tint="light"
        className="top-0 left-0 right-0 absolute justify-end items-start"
        style={{height: insets.top * 2}}
      >
        <Text className="font-semi pl-3 text-5xl text-zinc-800">{title}</Text>
      </AnimatedBlurView>
    </View>
  );
};

export default Wrapper;
