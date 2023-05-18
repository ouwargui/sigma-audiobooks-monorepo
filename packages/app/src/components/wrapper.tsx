import React, {PropsWithChildren, useState} from 'react';
import {BlurView} from 'expo-blur';
import {View, Text, ListRenderItem, NativeScrollEvent} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColorScheme} from '../hooks/useColorScheme';
import {useScrollToTop} from '@react-navigation/native';

type ScrollViewProps = {
  flatList?: false;
  scrollRef?: React.RefObject<Animated.ScrollView>;
};

type FlatListProps<T> = {
  flatList: true;
  scrollRef?: React.RefObject<Animated.FlatList<T>>;
  data?: T[];
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T>;
  renderHeader?: React.ReactElement;
  renderSpacer?: React.ComponentType;
  renderFooter?: React.ReactElement;
  renderEmpty?: React.ReactElement;
  onEndReached?: () => void;
};

type BaseProps = {
  title: string;
  onScroll?: (event: NativeScrollEvent) => void;
  renderStickyHeader?: React.ReactElement;
};

type Props<T> = PropsWithChildren<
  BaseProps & (ScrollViewProps | FlatListProps<T>)
>;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Wrapper = <T,>({children, title, ...props}: Props<T>) => {
  // @ts-expect-error - Didn't find a way to type this properly
  useScrollToTop(props.scrollRef ?? {current: null});

  const {isDarkMode} = useColorScheme();
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

      props.onScroll?.(event);
      runOnJS(setScrollYOffset)(value);
    },
  });

  const animatedBorder = useAnimatedStyle(() => {
    const initialColor = isDarkMode ? '#18181b' : '#fff';
    const finalColor = isDarkMode ? '#2c2c30' : '#a1a1aa';

    return {
      borderBottomColor: interpolateColor(
        scrollYOffset,
        [0, 50],
        [initialColor, finalColor],
      ),
      borderBottomWidth: 0.5,
    };
  });

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      {props.flatList ? (
        <Animated.FlatList
          ref={props.scrollRef}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: insets.top < 30 ? 80 : insets.top * 2,
          }}
          data={props.data}
          renderItem={props.renderItem}
          keyExtractor={props.keyExtractor}
          ListHeaderComponent={props.renderHeader}
          ItemSeparatorComponent={props.renderSpacer}
          ListFooterComponent={props.renderFooter}
          ListEmptyComponent={props.renderEmpty}
          onEndReached={props.onEndReached}
        />
      ) : (
        <Animated.ScrollView
          ref={props.scrollRef}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: insets.top < 30 ? 80 : insets.top * 2,
          }}
        >
          <View className="flex-1">{children}</View>
        </Animated.ScrollView>
      )}
      <View className="top-0 left-0 right-0 absolute justify-end items-start">
        <AnimatedBlurView
          intensity={scrollYOffset}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[animatedBorder, {paddingTop: insets.top}]}
          className="w-full"
        >
          <Text className="font-semi pl-4 text-5xl text-zinc-800 dark:text-zinc-100">
            {title}
          </Text>
        </AnimatedBlurView>
        <View className="h-2" />
        <View className="w-full">{props.renderStickyHeader}</View>
      </View>
    </View>
  );
};

export default Wrapper;
