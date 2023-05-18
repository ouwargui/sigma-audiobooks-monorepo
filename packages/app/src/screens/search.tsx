import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {TextInput, Text, View, NativeScrollEvent} from 'react-native';
import Wrapper from '../components/wrapper';
import {Ionicons} from '@expo/vector-icons';
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedKeyboard,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {trpc} from '../utils/trpc';
import SearchResults from '../components/search-results';
import {Book, SearchNavProps} from '../routes/types';
import {useColorScheme} from '../hooks/useColorScheme';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Search: React.FC<SearchNavProps> = ({navigation}) => {
  const {isDarkMode} = useColorScheme();
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const isInputFocused = useSharedValue(false);

  const onPressBook = (book: Book) => {
    navigation.navigate('Book', book);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <SearchWrapper
      isInputFocused={isInputFocused}
      onPressBook={onPressBook}
      query={debouncedInputValue}
      isDarkMode={isDarkMode}
    >
      <TextInput
        className="flex-1 text-zinc-600 dark:text-zinc-200 font-semi text-base"
        autoCapitalize="none"
        hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
        placeholderTextColor={isDarkMode ? '#52525b' : '#d4d8d4'}
        placeholder="What do you want to listen?"
        value={inputValue}
        onChangeText={setInputValue}
        onFocus={() => (isInputFocused.value = true)}
        onBlur={() => {
          if (inputValue) return;
          isInputFocused.value = false;
        }}
      />
    </SearchWrapper>
  );
};

type SearchWrapperProps = {
  query: string;
  isInputFocused: SharedValue<boolean>;
  onPressBook: (book: Book) => void;
  isDarkMode: boolean;
} & PropsWithChildren;

const SearchWrapper: React.FC<SearchWrapperProps> = ({
  query,
  isInputFocused,
  onPressBook,
  children,
  isDarkMode,
}) => {
  const scrollRef = useRef<Animated.FlatList<Book>>(null);
  const scrollYOffset = useSharedValue(0);
  const keyboard = useAnimatedKeyboard();

  const books = trpc.books.getByQuery.useQuery(query, {enabled: !!query});
  const recentlyAddedBooksPaginator =
    trpc.books.getRecentlyAdded.useInfiniteQuery(
      {limit: 5},
      {getNextPageParam: (lastPage) => lastPage.nextCursor, enabled: !query},
    );

  const recentlyAddedBooks = recentlyAddedBooksPaginator.data?.pages.map(
    (p) => p.books,
  );

  const animatedBorderStyle = useAnimatedStyle(() => {
    const colors = ['#52525b', '#e4e4e7'];

    return {
      borderColor: withTiming(
        interpolateColor(
          isInputFocused.value ? 1 : 0,
          [0, 1],
          isDarkMode ? colors : colors.reverse(),
        ),
      ),
      gap: 10,
      opacity: interpolate(scrollYOffset.value, [0, 30], [1, 0], 'clamp'),
      transform: [
        {
          translateY: interpolate(
            scrollYOffset.value,
            [0, 20],
            [0, -5],
            'clamp',
          ),
        },
      ],
    };
  });

  const animatedIconColor = useAnimatedProps(() => {
    const colors = ['#52525b', '#e4e4e7'];

    return {
      color: withTiming(
        interpolateColor(
          isInputFocused.value ? 1 : 0,
          [0, 1],
          isDarkMode ? colors : colors.reverse(),
        ),
      ),
    };
  });

  const animatedFooterHeight = useAnimatedStyle(() => {
    return {
      paddingBottom: keyboard.height.value === 0 ? 16 : keyboard.height.value,
    };
  });

  const onEndReached = () => {
    if (books.data || !recentlyAddedBooksPaginator.hasNextPage) return;

    void recentlyAddedBooksPaginator.fetchNextPage();
  };

  const onScroll = (event: NativeScrollEvent) => {
    'worklet';
    scrollYOffset.value = event.contentOffset.y;
  };

  return (
    <Wrapper
      scrollRef={scrollRef}
      title="Search"
      onScroll={onScroll}
      flatList
      onEndReached={onEndReached}
      data={books.data ?? recentlyAddedBooks?.flat()}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => (
        <SearchResults onPressBook={onPressBook} book={item} />
      )}
      renderEmpty={
        <View className="flex-1 justify-center items-center">
          <Text>No books for now :(</Text>
        </View>
      }
      renderStickyHeader={
        <Animated.View
          style={animatedBorderStyle}
          className="mx-4 rounded-xl border-2 justify-start items-center p-4 flex-row"
        >
          <AnimatedIcon
            name="search"
            size={24}
            animatedProps={animatedIconColor}
          />
          {children}
        </Animated.View>
      }
      renderHeader={
        <>
          <View className="h-[75px]" />
          {!books.data && recentlyAddedBooks && (
            <Text className="mx-4 font-semi text-zinc-500 dark:text-zinc-400">
              Recently added
            </Text>
          )}
          <View className="h-2" />
        </>
      }
      renderSpacer={() => <View className="h-4" />}
      renderFooter={<Animated.View style={animatedFooterHeight} />}
    />
  );
};

export default Search;
