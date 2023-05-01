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

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Search: React.FC = () => {
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

  return (
    <Wrapper title="Search">
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
          className="flex-1 text-zinc-600 font-semi text-base leading-none"
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
    </Wrapper>
  );
};

export default Search;
