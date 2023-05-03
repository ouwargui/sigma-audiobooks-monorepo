import React, {PropsWithChildren, useEffect, useState} from 'react';
import {TextInput, Text, View} from 'react-native';
import Wrapper from '../components/wrapper';
import {Ionicons} from '@expo/vector-icons';
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {trpc} from '../utils/trpc';
import SearchResults from '../components/search-results';
import {Book, SearchNavProps} from '../routes/types';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Search: React.FC<SearchNavProps> = ({navigation}) => {
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
    >
      <TextInput
        className="flex-1 text-zinc-600 font-semi text-base"
        autoCapitalize="none"
        hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
        placeholderTextColor="#d4d8d4"
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
} & PropsWithChildren;

const SearchWrapper: React.FC<SearchWrapperProps> = ({
  query,
  isInputFocused,
  onPressBook,
  children,
}) => {
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
    return {
      borderColor: withTiming(
        interpolateColor(
          isInputFocused.value ? 1 : 0,
          [0, 1],
          ['#d4d8d4', '#52525b'],
        ),
      ),
      gap: 10,
    };
  });

  const animatedIconColor = useAnimatedProps(() => {
    return {
      color: withTiming(
        interpolateColor(
          isInputFocused.value ? 1 : 0,
          [0, 1],
          ['#d4d8d4', '#52525b'],
        ),
      ),
    };
  });

  const onEndReached = () => {
    if (books.data || !recentlyAddedBooksPaginator.hasNextPage) return;

    void recentlyAddedBooksPaginator.fetchNextPage();
  };

  return (
    <Wrapper<Book>
      title="Search"
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
      renderHeader={
        <>
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
          <View className="h-2" />
          {!books.data && recentlyAddedBooks && (
            <Text className="mx-4 font-semi text-zinc-500">Recently added</Text>
          )}
          <View className="h-2" />
        </>
      }
      renderSpacer={() => <View className="h-4" />}
      renderFooter={<View className="h-4" />}
    />
  );
};

export default Search;
