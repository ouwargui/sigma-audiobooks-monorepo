import React from 'react';
import {View, Text} from 'react-native';
import {Book} from '../routes/types';
import BookCoverArt from './book-cover-art';
import ScalableButton from './scalable-button';

type Props = {
  book: Book;
  onPressBook: (book: Book) => void;
};

const SearchResults: React.FC<Props> = ({book, onPressBook}) => {
  return (
    <ScalableButton scaleTo={0.95} onPress={() => onPressBook(book)}>
      <View className="mx-4 flex-row">
        <View className="w-20">
          <BookCoverArt coverArtUrl={book.coverArtUrl} />
        </View>
        <View className="w-2" />
        <View className="flex-1 py-4 justify-between items-start">
          <View>
            <Text className="text-base font-semi text-primary-light dark:text-primary-dark leading-5">
              {book.title}
            </Text>
            <Text className="text-base font-regular text-secondary-light dark:text-secondary-dark">
              {book.author}
            </Text>
          </View>
          <View>
            <Text className="text-sm font-regular text-secondary-light dark:text-secondary-dark">
              {book.totalChapters} chapters
            </Text>
            <Text className="text-sm font-regular text-secondary-light dark:text-secondary-dark">
              {book.totalListeners}{' '}
              {book.totalListeners === 1 ? 'listener' : 'listeners'}
            </Text>
          </View>
        </View>
      </View>
    </ScalableButton>
  );
};

export default SearchResults;
