import React, {useState} from 'react';
import {View, Text, Share} from 'react-native';
import {BookNavProps} from '../routes/types';
import BookCoverArt from '../components/book-cover-art';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import Animated, {
  FadeInDown,
  FadeOutDown,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import ScalableButton from '../components/scalable-button';
import {usePlayer} from '../hooks/usePlayer';
import {trpc} from '../utils/trpc';
import {useColorScheme} from '../hooks/useColorScheme';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Book: React.FC<BookNavProps> = ({route, navigation}) => {
  const {id: bookId} = route.params;
  const player = usePlayer();
  const insets = useSafeAreaInsets();
  const {isDarkMode} = useColorScheme();
  const [scrollYOffset, setScrollYOfsset] = useState(0);
  const scrollY = useSharedValue(0);
  const {data: book} = trpc.books.getById.useQuery(bookId);
  const mutation = trpc.books.addListener.useMutation();

  const isBookPlaying = player.currentBook?.id === bookId;

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scrollY.value = event.contentOffset.y;
      runOnJS(setScrollYOfsset)(
        interpolate(event.contentOffset.y, [0, 50], [0, 40], 'clamp'),
      );
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
      borderBottomWidth: 1,
    };
  });

  if (!book) {
    return <View className="flex-1 bg-white dark:bg-zinc-900" />;
  }

  const handleListenButton = async () => {
    await player.loadBook(book);
    mutation.mutate(book.id);
    navigation.navigate('main', {screen: 'Play', params: {shouldPlay: false}});
  };

  const onShare = async () => {
    await Share.share({
      message: `Check out ${book.title} by ${book.author} on Sigma Audiobooks`,
      url: `https://audiobooks.guisantos.dev/app/book/${book.id}`,
    });
  };

  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top + 46,
          paddingBottom: insets.bottom,
        }}
      >
        <View className="flex-1">
          <View className="justify-center items-center" style={{gap: 10}}>
            <View className="w-36">
              <BookCoverArt coverArtUrl={book.coverArtUrl} />
            </View>
            <View
              style={{gap: 5}}
              className="border-[1px] border-zinc-500 dark:border-zinc-400 p-1 flex-row rounded-full justify-between items-center"
            >
              <View className="w-2 h-2 bg-blue-700 dark:bg-blue-500 rounded-full"></View>
              <View className="w-2 h-2 bg-zinc-500 dark:bg-zinc-400 rounded-full"></View>
            </View>
          </View>
          <View className="h-4" />
          <View
            className="mx-4 items-center flex-row flex-wrap"
            style={{gap: 4}}
          >
            {book.tags.map((tag, idx) => (
              <View
                key={idx}
                className="justify-between items-center rounded-full border-[1px] border-zinc-700 dark:border-zinc-200 p-2"
              >
                <Text className="font-semi text-zinc-800 dark:text-zinc-100 text-base capitalize">
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
          <View className="h-4" />
          <View className="flex-row mx-4">
            <View className="flex-1 justify-center">
              <Text className="font-semi text-2xl text-zinc-800 dark:text-zinc-100">
                {book.title}
              </Text>
              <Text className="font-regular text-base text-zinc-500 dark:text-zinc-400">
                {book.author}
              </Text>
            </View>
            <View style={{gap: 5}} className="flex-row-reverse justify-start">
              <View className="justify-between">
                <ScalableButton onPress={() => console.log('rate')}>
                  <View
                    className="flex-row rounded-md items-center justify-center bg-blue-600 py-2 px-3"
                    style={{gap: 5}}
                  >
                    <Ionicons name="star-outline" size={20} color="#fafafa" />
                    <Text className="text-zinc-50 font-bold text-base">
                      4,45
                    </Text>
                  </View>
                </ScalableButton>
                <View style={{gap: -5}}>
                  <Text className="font-regular text-base text-zinc-500 dark:text-zinc-400">
                    100K
                  </Text>
                  <Text className="font-regular text-base text-zinc-500 dark:text-zinc-400">
                    Reviews
                  </Text>
                </View>
              </View>
              <View className="h-full w-[1px] bg-zinc-300 dark:bg-zinc-600" />
            </View>
          </View>
          <View className="h-4" />
          <View className="mx-4">
            <Text className="font-semi text-base text-justify text-zinc-800 dark:text-zinc-100">
              {book.description}
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
      <AnimatedBlurView
        className="absolute left-0 top-0 right-0 flex-row justify-between items-center px-4 pb-4"
        tint={isDarkMode ? 'dark' : 'light'}
        intensity={scrollYOffset}
        style={[
          {paddingTop: insets.top <= 20 ? 24 : insets.top},
          animatedBorder,
        ]}
      >
        <ScalableButton onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDarkMode ? '#f4f4f5' : '#18181b'}
          />
        </ScalableButton>
        <ScalableButton onPress={() => void onShare()}>
          <Ionicons
            name="send-outline"
            size={24}
            color={isDarkMode ? '#f4f4f5' : '#18181b'}
          />
        </ScalableButton>
      </AnimatedBlurView>
      {scrollY.value < 50 && !isBookPlaying && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          exiting={FadeOutDown.duration(300)}
          style={[{paddingBottom: insets.bottom || 20}]}
          className="absolute bottom-0 left-0 right-0 flex-row justify-center items-center"
        >
          <ScalableButton
            className="flex-1"
            onPress={() => void handleListenButton()}
          >
            <View className="flex-1 py-4 mx-10 justify-center items-center rounded-full bg-blue-600">
              <Text className="text-zinc-50 font-bold text-lg">Listen</Text>
            </View>
          </ScalableButton>
        </Animated.View>
      )}
    </View>
  );
};

export default Book;
