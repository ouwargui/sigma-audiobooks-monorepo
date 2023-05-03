import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import Wrapper from '../components/wrapper';
import {Ionicons} from '@expo/vector-icons';
import Animated, {
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
  const books = trpc.books.getAll.useQuery();

  const [inputValue, setInputValue] = useState('');
  const isInputFocused = useSharedValue(false);

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

  if (!books.data) return null;

  const onPressBook = (book: Book) => {
    navigation.navigate('Book', book);
  };

  return (
    <Wrapper<(typeof books.data)[number]>
      title="Search"
      flatList
      data={books.data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => (
        <SearchResults onPressBook={onPressBook} book={item} />
      )}
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
          </Animated.View>
          <View className="h-4" />
        </>
      }
      renderSpacer={() => <View className="h-4" />}
      renderFooter={<View className="h-4" />}
    />
  );
};

export default Search;
