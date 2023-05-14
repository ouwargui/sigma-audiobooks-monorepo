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

type ScrollViewProps = {
  flatList?: false;
};

type FlatListProps<T> = {
  flatList: true;
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
    <View className="flex-1 bg-white dark:bg-zinc-900">
      {props.flatList ? (
        <Animated.FlatList
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
          tint="light"
          style={[animatedBorder, {paddingTop: insets.top}]}
          className="w-full"
        >
          <Text className="font-semi pl-4 text-5xl text-zinc-800 dark:text-zinc-50">
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
